const emojiMap = {
  neutral: "meh",
  angry: "angry",
  //disgusted: "grin-tongue-squint",
  //fearful: "grimace",
  happy: "grin",
  sad: "sad-tear",
  surprised: "surprise"
};


const emojiGenderMap = {
  male: "male",
  female: "female",
};

export const mapExpressionToEmoji = expression => emojiMap[expression];
export const mapExpressionGenderToEmoji = expression => emojiGenderMap[expression];
export const emotions = Object.keys(emojiMap);
