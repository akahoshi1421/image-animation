# imageAnime.js

CSS アニメーションでは実装が難しい画像アニメーションをやってくれます。

## 使い方

```
npm i @akahoshi1421/image-animation
```

例

```.js
//source image file or URL
const imgSrc = "img/computer.png"; // http://127.0.0.1:8080/img/computer.png

//target dom
const target: HTMLElement = document.querySelector(".result")!;

const main = async () => {
    //src, dst, fadein or fadeout
  const anime = await ImageAnime.init(imgSrc, target, "in");

  //run fadeAnime
  anime.randomFadeAnime(5);
};

main();
```

![アニメーション例](image-animation.gif)

## License

This is under MIT license.
