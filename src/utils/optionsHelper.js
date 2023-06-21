const titles = ["PC", "Nintendo", "PS4", "PS5", "XBOX"];

function getPlatformOptions(platform) {
  const options = titles.map((title) => ({
    title: title,
    isSelected: title == platform,
  }));
  return options;
}

module.exports = getPlatformOptions;
