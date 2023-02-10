import { createApp } from "vue";
import PodcastPlayer from "./components/PodcastPlayer.vue";
/**
 * Extract data and render podcast player to element.
 * @param {HTMLElement} element
 */
function renderPodcastPlayer(element) {
  const src = element.dataset["src"];
  const title = element.dataset["title"];
  const cover = element.dataset["cover"];

  if (!src || !title || !cover) {
    console.error("Podcast player is missing data attributes");
    return;
  }

  const app = createApp(PodcastPlayer, { src, title, cover });
  app.mount(element);
}

document
  .querySelectorAll(".podcast-player")
  .forEach((el) => renderPodcastPlayer(el));
