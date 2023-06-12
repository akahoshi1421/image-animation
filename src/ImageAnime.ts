export class ImageAnime {
  private targetImg: string;
  private outputElement: HTMLElement;
  private fadeOption: string;

  public imgWidth!: number;
  public imgHeight!: number;

  private canvasContext: CanvasRenderingContext2D | undefined;

  public pixelsArray: number[] = [];

  private constructor(
    targetImg: string,
    outputElement: HTMLElement,
    fadeOption: "in" | "out"
  ) {
    this.targetImg = targetImg;
    this.outputElement = outputElement;
    this.fadeOption = fadeOption;
  }

  /**
   * アニメーションの初期設定をする \
   * animaton init settings
   *
   * @param targetImg 画像のパス image path
   * @param outputElement 出力先の要素(対象domの中にcanvasが生成される) outout Element
   * @param fadeOption フェードインかフェードアウトか fadein or fadeout ("in" => fadein, "out" => fadeout)
   * @returns
   */
  public static async init(
    targetImg: string,
    outputElement: HTMLElement,
    fadeOption: "in" | "out"
  ): Promise<ImageAnime> {
    const imageAnime = new ImageAnime(targetImg, outputElement, fadeOption);
    imageAnime.targetImg = targetImg;
    imageAnime.outputElement = outputElement;
    await imageAnime.build();
    return imageAnime;
  }

  private build() {
    const newCanvas: HTMLCanvasElement = document.createElement("canvas");

    const context: CanvasRenderingContext2D = newCanvas.getContext("2d")!;

    this.canvasContext = context;

    return new Promise((resolve, reject) => {
      const img: HTMLImageElement = new Image();

      img.src = this.targetImg;
      this.outputElement.appendChild(newCanvas);

      img.onload = () => {
        this.imgWidth = img.width;
        this.imgHeight = img.height;

        newCanvas.width = this.imgWidth;
        newCanvas.height = this.imgHeight;
        this.canvasContext!.drawImage(img, 0, 0, img.width, img.height);

        //フェードインアニメーション用にあらかじめ隠しておく
        if (this.fadeOption === "in") {
          const imgData = this.canvasContext!.getImageData(
            0,
            0,
            this.imgWidth,
            this.imgHeight
          );
          this.pixelsArray = [...Array.from(imgData.data)];

          const pixels = imgData.data;
          for (let y = 0; y < this.imgHeight; y++) {
            for (let x = 0; x < this.imgWidth; x++) {
              const base: number = (y * this.imgWidth + x) * 4;

              pixels[base + 3] = 0; // Alpha
            }
          }

          this.canvasContext!.putImageData(imgData, 0, 0);
        }

        resolve(img);
      };

      img.onerror = (e) => reject(e);
    });
  }

  /**
   * ランダムにピクセルが消えていくアニメーション \
   * Animation of randomly disappearing pixels
   *
   * @param duration アニメーションにかける時間(s) animation duration(second)
   */
  public randomFadeAnime(duration: number): void {
    const startTime = new Date().getTime();

    for (let y = 0; y < this.imgHeight; y++) {
      for (let x = 0; x < this.imgWidth; x++) {
        const imgData = this.canvasContext!.getImageData(x, y, 1, 1);

        const randomTime = Math.random() * duration;

        const nowTime = new Date().getTime();

        setTimeout(() => {
          if (this.fadeOption === "in") {
            imgData.data[0] = this.pixelsArray[(y * this.imgWidth + x) * 4];
            imgData.data[1] = this.pixelsArray[(y * this.imgWidth + x) * 4 + 1];
            imgData.data[2] = this.pixelsArray[(y * this.imgWidth + x) * 4 + 2];
            imgData.data[3] = 255;
          } else {
            imgData.data[3] = 0;
          }

          this.canvasContext!.putImageData(imgData, x, y);
        }, randomTime * 1000 - (nowTime - startTime));
      }
    }
  }
}
