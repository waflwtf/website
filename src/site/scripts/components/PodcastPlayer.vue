<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import PlayIcon from "/assets/icons/icon-play.svg?url";
import PauseIcon from "/assets/icons/icon-pause.svg?url";
import DownloadIcon from "/assets/icons/icon-download.svg?url";
import BackIcon from "/assets/icons/icon-back.svg?url";
import ForwardIcon from "/assets/icons/icon-forward.svg?url";

const props = defineProps(["src", "cover", "title"]);

const state = reactive({
  playing: false,
  seekingPosition: undefined,
  position: 0,
  duration: 0,
});

const audioElement = ref(null);

const currentPosition = computed(() =>
  Math.floor(
    state.seekingPosition == undefined ? state.position : state.seekingPosition
  )
);

const flooredDuration = computed(() => Math.floor(state.duration));

function secondsToHMS(s) {
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = Math.floor(s % 60);

  return { hours, minutes, seconds };
}

function formatSecondsToDisplay(s) {
  const { hours, minutes, seconds } = secondsToHMS(s);

  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

function pluralize(s, n) {
  return `${n} ${s}${n === 0 || n > 1 ? "n" : ""}`;
}

function formatSecondToValuetext(s) {
  const { hours, minutes, seconds } = secondsToHMS(s);

  const hoursText = hours === 0 ? "" : pluralize("Stunde", hours);
  const minutesText = minutes === 0 ? "" : pluralize("Minute", minutes);
  const secondsText = pluralize("Sekunde", seconds);

  return `${hoursText} ${minutesText} ${secondsText}`.trim();
}

function formatSecondsToDuration(s) {
  const { hours, minutes, seconds } = secondsToHMS(s);
  return `PT${hours}H${minutes}M${seconds}S`;
}

function togglePlayPause() {
  if (state.playing) {
    audioElement.value.pause();
  } else {
    audioElement.value.play();
  }
}

function goBack() {
  setPosition(Math.max(0, state.position - 10));
}
function goForward() {
  setPosition(Math.min(state.duration, state.position + 30));
}

function setPosition(value) {
  state.position = value;
  audioElement.value.currentTime = state.position;
  state.seekingPosition = undefined;
}

onMounted(() => {
  audioElement.value.readyState > 0
    ? (state.duration = audioElement.value.duration)
    : undefined;
});
</script>

<template>
  <div
    class="flex flex-col gap-2 bg-white p-2"
    role="region"
    aria-label="Podcast Player"
  >
    <div class="flex flex-col md:flex-row gap-2">
      <audio
        ref="audioElement"
        :src="src"
        preload="metadata"
        @loadedmetadata="state.duration = $event.target.duration"
        @:pause="state.playing = false"
        @:play="state.playing = true"
        @:timeupdate="state.position = $event.target.currentTime"
      ></audio>
      <img class="w-52 h-52 self-center" :src="cover" alt="" />
      <div class="flex flex-col md:block md:flex-grow md:self-center">
        <div class="my-4 flex justify-center items-center gap-6">
          <button class="w-12 h-12" @:click="goBack()" title="-10 Sekunden">
            <img
              :src="BackIcon"
              alt=""
              class="hover:opacity-75 transition-opacity w-full h-full"
            />
          </button>
          <button
            class="w-14 h-14"
            @:click="togglePlayPause()"
            :title="state.playing ? 'Pause' : 'Play'"
          >
            <img
              :src="state.playing ? PauseIcon : PlayIcon"
              alt=""
              class="hover:opacity-75 transition-opacity w-full h-full"
            />
          </button>
          <button class="w-12 h-12" @:click="goForward()" title="+ 30 Sekunden">
            <img
              :src="ForwardIcon"
              alt=""
              class="hover:opacity-75 transition-opacity w-full h-full"
            />
          </button>
        </div>
        <div class="w-100">
          <input
            class="col-start-1 col-span-full"
            type="range"
            aria-label="Wiedergabeposition"
            :style="{
              '--min': 0,
              '--max': flooredDuration,
              '--val': currentPosition,
            }"
            :aria-valuetext="formatSecondToValuetext(currentPosition)"
            :max="flooredDuration"
            :value="currentPosition"
            @:input="state.seekingPosition = $event.target.value"
            @:change="setPosition($event.target.value)"
          />
          <div class="flex flex-row justify-between">
            <div class="tabular-nums text-left">
              <time :datetime="formatSecondsToDuration(currentPosition)">{{
                formatSecondsToDisplay(currentPosition)
              }}</time>
            </div>
            <div class="tabular-nums text-right">
              <time :datetime="formatSecondsToDuration(state.duration)">{{
                formatSecondsToDisplay(state.duration)
              }}</time>
            </div>
          </div>
        </div>
        <div class="text-center mt-4 max-w-sm mx-auto">
          <a
            class="flex flex-col items-center justify-center md:flex-row md:gap-2 bg-yellow-300 border-solid border-yellow-300 border-4 text-black p-3 font-bold focus:bg-white hover:bg-white"
            :href="src"
            :download="title"
          >
            <img :src="DownloadIcon" alt="" class="inline-block w-10" />
            Episode &bdquo;{{ title }}&ldquo; herunterladen</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="range"] {
  --range: calc(var(--max) - var(--min));
  --ratio: calc((var(--val) - var(--min)) / var(--range));
  --sx: calc(0.5 * 1.5em + var(--ratio) * (100% - 1.5em));
  --progress-color: theme(colors.sky[500]);
  --range-color: theme(colors.neutral[300]);
  @apply appearance-none
      h-4
      w-full
      bg-white;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none
      bg-sky-400
      border-transparent
      h-4
      w-4
      rounded-full
      shadow-md
      cursor-grab;
  margin-top: -0.25rem;
}

input[type="range"]::-webkit-slider-thumb:active {
  @apply cursor-grabbing;
}

input[type="range"]::-moz-range-thumb {
  @apply appearance-none
      bg-sky-400
      border-transparent
      h-4
      w-4
      rounded-full
      shadow-md
      cursor-grab;
}

input[type="range"]::-moz-range-thumb:active {
  @apply cursor-grabbing;
}

input[type="range"]::-moz-range-track {
  @apply appearance-none
    h-2
    rounded
    cursor-pointer;
  background: var(--range-color);
}

input[type="range"]::-moz-range-progress {
  @apply appearance-none
      h-2
      rounded-l
      cursor-pointer;
  background: var(--progress-color);
}

input[type="range"]::-webkit-slider-runnable-track {
  @apply appearance-none
    h-2
    rounded
    cursor-pointer
      bg-black;

  background: linear-gradient(var(--progress-color), var(--progress-color)) 0 /
    var(--sx) 100% no-repeat var(--range-color);
}
</style>
