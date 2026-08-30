type EditorialHeadingProps = {
  lines: string[];
  mode?: 'statement' | 'lines';
  className?: string;
};

export function EditorialHeading({ lines, mode = 'lines', className = '' }: EditorialHeadingProps) {
  return (
    <h2 className={`editorial-heading editorial-heading-${mode} ${className}`.trim()}>
      {lines.map((line, index) => (
        <span key={`${index}-${line}`}>
          {mode === 'statement' && <i className="mono" aria-hidden="true">{String(index + 1).padStart(2, '0')}</i>}
          <b>{line}</b>
        </span>
      ))}
    </h2>
  );
}

export function editorialLines(text: string) {
  return text.split('\n').map((line) => line.trim()).filter(Boolean);
}
