import { ImageAnime } from "./ImageAnime";

export * from "./ImageAnime";

const imgSrc: string = "computer.png";
const target: HTMLElement = document.querySelector(".result")!;

let anime: ImageAnime;

const main = async () => {
  anime = await ImageAnime.init(imgSrc, target, "in");
  anime.randomFadeAnime(5);
};

main();
