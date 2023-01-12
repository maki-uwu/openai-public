export const commands = [
  {
    name: "ask",
    description: "Ask ChatGPT a question",
    options: [
      {
        name: "prompt",
        description: "Type in the question you wish to ask ChatGPT",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "draw",
    description: "Draw an image with DALL·E",
    options: [
      {
        name: "prompt",
        description: "Describe the image you wish DALL·E to draw",
        type: 3,
        required: true,
      },
    ],
  },
];
