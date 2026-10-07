import { strict as assert } from "node:assert";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { resolveComponentData, type StreamDocument } from "@yext/visual-editor";
import { getRichTextStyleOverrides, renderRichText } from "./sectionHelpers";

for (const { name, value, streamDocument } of [
  {
    name: "when body text uses a constant then its styles override the saved HTML styles",
    value: {
      field: "description",
      constantValueEnabled: true,
      constantValue: {
        defaultValue: {
          html: '<p style="font-size: 14px; color: red"><strong>Body text</strong></p>',
        },
      },
    },
    streamDocument: { locale: "en" } satisfies StreamDocument,
  },
  {
    name: "when body text uses an entity field then its styles override the saved HTML styles",
    value: {
      field: "description",
      constantValueEnabled: false,
      constantValue: { defaultValue: { html: "Unused constant" } },
    },
    streamDocument: {
      locale: "en",
      description: {
        html: '<p style="font-size: 14px; color: red"><strong>Body text</strong></p>',
      },
    } satisfies StreamDocument,
  },
]) {
  test(name, (): void => {
    const markup = renderToStaticMarkup(
      renderRichText(resolveComponentData(value, "en", streamDocument), {
        fontFamily: "Arial",
        fontSize: "24px",
        fontWeight: "700",
        fontStyle: "italic",
        textTransform: "uppercase",
        color: "#123456",
      }),
    );

    assert.match(markup, /class="rtf-theme rtf-wrapper"/);
    assert.match(markup, /--fontFamily-body-fontFamily:Arial/);
    assert.match(markup, /--fontSize-body-fontSize:24px/);
    assert.match(markup, /--fontWeight-body-fontWeight:700/);
    assert.match(markup, /--fontStyle-body-fontStyle:italic/);
    assert.match(markup, /--textTransform-body-textTransform:uppercase/);
    assert.match(markup, /color:#123456/);
    assert.match(markup, /<strong>Body text<\/strong>/);
  });
}

test("when text styles use defaults then the theme variables remain in use", (): void => {
  const markup = renderToStaticMarkup(
    renderRichText(
      resolveComponentData({ html: "<p>Body text</p>" }, "en"),
      {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
      },
    ),
  );

  assert.match(markup, /class="rtf-theme rtf-wrapper"/);
  assert.doesNotMatch(markup, /style=/);
  assert.match(markup, /<p>Body text<\/p>/);
});

for (const { name, color, expectedColor } of [
  {
    name: "when a custom font color is resolved then its CSS value remains valid",
    color: { selectedColor: "[#123456]", contrastingColor: "white" },
    expectedColor: "color:#123456",
  },
  {
    name: "when a palette font color is resolved then its CSS variable remains valid",
    color: { selectedColor: "palette-primary", contrastingColor: "white" },
    expectedColor: "color:var(--colors-palette-primary)",
  },
]) {
  test(name, (): void => {
    const markup = renderToStaticMarkup(
      renderRichText(
        resolveComponentData({ html: "<p>Body text</p>" }, "en"),
        getRichTextStyleOverrides(
          undefined,
          { family: "Arial", size: "16px", weight: "400" },
          color,
        ),
      ),
    );

    assert.equal(markup.includes(expectedColor), true);
  });
}
