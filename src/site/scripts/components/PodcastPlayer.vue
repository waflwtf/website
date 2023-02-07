<script setup>
import uniqueId from "lodash/uniqueId";
import { ref, reactive, watch, computed, onMounted } from "vue";
import PlayIcon from "/assets/icons/icon-play.svg?url";
import PauseIcon from "/assets/icons/icon-pause.svg?url";
import MuteIcon from "/assets/icons/icon-mute.svg?url";
import UnmuteIcon from "/assets/icons/icon-unmute.svg?url";
import DownloadIcon from "/assets/icons/icon-download.svg?url";

const uid = uniqueId();

const props = defineProps(["src", "cover", "title"]);

const state = reactive({
  playing: false,
  seekingPosition: undefined,
  position: 0,
  duration: 0,
  volume: 100,
  muted: false,
});

const audioElement = ref(null);

const currentPosition = computed(() =>
  Math.floor(
    state.seekingPosition == undefined ? state.position : state.seekingPosition
  )
);

function secondsToHMS(s) {
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = Math.floor(s % 60);

  return { hours, minutes, seconds };
}

function formatSeconds(s) {
  function twoDigitsNumberString(n) {
    return n >= 10 ? n.toString() : `0${n}`;
  }

  const { hours, minutes, seconds } = secondsToHMS(s);

  return `${twoDigitsNumberString(hours)}:${twoDigitsNumberString(
    minutes
  )}:${twoDigitsNumberString(seconds)}`;
}

function formatSecondsForValuetext(s) {
  const { hours, minutes, seconds } = secondsToHMS(s);
  const hoursText =
    hours === 0 ? "" : `${hours} ${hours === 1 ? "Stunde" : "Stunden"}`;
  const minutesText =
    minutes === 0 ? "" : `${minutes} ${minutes === 1 ? "Minute" : "Minuten"}`;
  const secondsText =
    seconds === 0
      ? "0 Sekunden"
      : `${seconds} ${seconds === 1 ? "Sekunde" : "Sekunden"}`;

  return `${hoursText} ${minutesText} ${secondsText}`.trim();
}

function formatSecondsForTime(s) {
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

function setPosition(event) {
  state.position = event.target.value;
  audioElement.value.currentTime = state.position;
  state.seekingPosition = undefined;
}

watch(
  () => state.volume,
  (volume) => {
    audioElement.value.volume = volume / 100;
  }
);
watch(
  () => state.muted,
  (muted) => {
    audioElement.value.muted = muted;
  }
);

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
      <img class="w-52 h52 self-center" :src="cover" alt="" />
      <div class="flex flex-col md:block md:flex-grow md:self-center">
        <button
          class="w-12 h-12 self-center flex-none md:mx-auto"
          @:click="togglePlayPause()"
          :title="state.playing ? 'Pause' : 'Play'"
        >
          <img
            :src="state.playing ? PauseIcon : PlayIcon"
            class="hover:drop-shadow-lg w-full h-full"
          />
        </button>
        <div class="w-100">
          <input
            class="col-start-1 col-span-full"
            type="range"
            aria-label="Wiedergabeposition"
            :style="{
              '--min': 0,
              '--max': Math.floor(state.duration),
              '--val': currentPosition,
            }"
            :aria-valuetext="formatSecondsForValuetext(currentPosition)"
            :max="Math.floor(state.duration)"
            :value="currentPosition"
            @:input="state.seekingPosition = $event.target.value"
            @:change="setPosition"
          />
          <div class="flex flex-row justify-between">
            <div class="tabular-nums text-left">
              <time :datetime="formatSecondsForTime(currentPosition)">{{
                formatSeconds(currentPosition)
              }}</time>
            </div>
            <div class="tabular-nums text-right">
              <time :datetime="formatSecondsForTime(state.duration)">{{
                formatSeconds(state.duration)
              }}</time>
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-2 items-center md:justify-end">
          <output
            :for="`volume-${uid}`"
            class="flex-none text-right tabular-nums w-10"
            >{{ `${state.volume}%` }}</output
          >
          <div class="flex-grow md:flex-grow-0 md:w-1/3 flex items-center">
            <input
              :id="`volume-${uid}`"
              type="range"
              max="100"
              aria-label="Lautstärke"
              :style="{ '--min': 0, '--max': 100, '--val': state.volume }"
              :value="state.volume"
              @:input="state.volume = $event.target.value"
            />
          </div>
          <button
            class="w-8 h-8"
            :title="state.muted ? 'Stummschaltung aufheben' : 'stumm schalten'"
            @:click="state.muted = !state.muted"
          >
            <img :src="state.muted ? UnmuteIcon : MuteIcon" alt="" />
          </button>
        </div>
        <div class="text-center mt-4 max-w-sm mx-auto">
          <a
            class="flex flex-col items-center justify-center md:flex-row bg-yellow-300 border-solid border-yellow-300 border-4 text-black p-3 font-bold focus:bg-white hover:bg-white"
            :href="src"
            :download="title"
          >
            <img :src="DownloadIcon" class="inline-block w-10" />
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
