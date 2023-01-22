module.exports = function contentBox(
  content,
  heading,
  imageSrc,
  imageAlt,
  reverse
) {
  return `
    <div class="
            flex
            ${reverse ? "flex-row-reverse" : "flex-row"}
            gap-4
            p-4
            mb-2
            bg-white
            border-4
            rounded
            border-yellow-300">
    <div class="prose flex-auto">
        <h2>${heading}</h2>
        ${content}
    </div>
    <div class="flex justify-center flex-grow items-center">
        <img class="border-4 rounded-full border-sky-400" src="${imageSrc}" alt="${imageAlt}" />
    </div>
    </div>`;
};
