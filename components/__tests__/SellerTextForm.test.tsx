import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import SellerTextForm from '../SellerTextForm';

const PHONE_MASK_NOTE =
  '電話番号らしき文字列は、送信前にブラウザ内で自動的にマスクされます。';

describe('SellerTextForm accessible description', () => {
  const html = renderToStaticMarkup(
    <SellerTextForm
      loading={false}
      hasResult={false}
      onCheck={() => {}}
      onClear={() => {}}
    />,
  );

  it('connects the phone-masking note to the textarea via aria-describedby', () => {
    expect(html).toContain(PHONE_MASK_NOTE);

    const noteMatch = html.match(
      /<([a-z]+)([^>]*)>\s*電話番号らしき文字列は、送信前にブラウザ内で自動的にマスクされます。\s*<\/\1>/,
    );
    expect(noteMatch, 'expected an element wrapping the phone-masking note').not.toBeNull();

    const noteId = noteMatch![2].match(/\sid="([^"]+)"/)?.[1];
    expect(noteId, 'expected the phone-masking note element to have an id').toBeTruthy();

    const textareaMatch = html.match(/<textarea\b([^>]*)>/);
    expect(textareaMatch, 'expected a seller-info textarea').not.toBeNull();

    const describedBy = textareaMatch![1].match(/\saria-describedby="([^"]*)"/)?.[1];
    expect(
      describedBy,
      'expected the textarea to have aria-describedby',
    ).toBeTruthy();

    const describedIds = describedBy!.trim().split(/\s+/);
    expect(describedIds).toContain(noteId);
  });
});
