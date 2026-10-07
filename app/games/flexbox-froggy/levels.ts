export type Level = {
    id: number;
    instructions: string;
    boardMarkup: string; // HTML string to render the frogs
    expectedCss: string; // The CSS needed to win
    initialCss?: string; // Optional starting CSS
};

export const levels: Level[] = [
    {
        id: 1,
        instructions: "Welcome to Flexbox Froggy. A game where you help Froggy and friends by writing CSS code! Guide this frog to the lilypad on the right by using the <code>justify-content</code> property, which aligns items horizontally and accepts the following values: <ul><li><code>flex-start</code>: Items align to the left side of the container.</li><li><code>flex-end</code>: Items align to the right side of the container.</li><li><code>center</code>: Items align at the center of the container.</li><li><code>space-between</code>: Items display with equal spacing between them.</li><li><code>space-around</code>: Items display with equal spacing around them.</li></ul> For example, <code>justify-content: flex-end;</code> will move the frog to the right.",
        boardMarkup: `<div class="frog bg-green-500">🐸</div>`,
        expectedCss: `justify-content: flex-end;`,
    },
    {
        id: 2,
        instructions: "Use <code>justify-content</code> again to help these frogs get to their lilypads. Remember that this CSS property aligns items horizontally and accepts the following values: <code>flex-start</code>, <code>flex-end</code>, <code>center</code>, <code>space-between</code>, <code>space-around</code>.",
        boardMarkup: `<div class="frog bg-green-500">🐸</div><div class="frog bg-yellow-400">🐸</div>`,
        expectedCss: `justify-content: center;`,
    },
    {
        id: 3,
        instructions: "Help all three frogs find their lilypads just by using <code>justify-content</code>. This time, the lilypads have lots of space all around them.",
        boardMarkup: `<div class="frog bg-green-500">🐸</div><div class="frog bg-yellow-400">🐸</div><div class="frog bg-red-500">🐸</div>`,
        expectedCss: `justify-content: space-around;`,
    }
];
