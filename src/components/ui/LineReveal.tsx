import { TextEngine, type HtmlTags } from 'spring-text-engine';
import { LINE_CONFIG, LINE_IN, LINE_OUT } from '../../lib/textReveal';

interface LineRevealProps {
  /**
   * Each entry is its own clipped line. Use this where the break points are
   * part of the design; let a single TextEngine wrap naturally otherwise.
   */
  lines: string[];
  as?: HtmlTags;
  delay?: number;
  lineStagger?: number;
  /** Gate for content that waits on the intro loader. */
  enabled?: boolean;
  className?: string;
}

export function LineReveal({
  lines,
  as: Tag = 'h2',
  delay = 0,
  lineStagger = 0,
  enabled = true,
  className = '',
}: LineRevealProps) {
  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <TextEngine
          key={line}
          as="span"
          mode="once"
          enabled={enabled}
          overflow
          delayIn={delay + index * lineStagger}
          lineIn={LINE_IN}
          lineOut={LINE_OUT}
          lineConfig={LINE_CONFIG}
          className="block"
        >
          {line}
        </TextEngine>
      ))}
    </Tag>
  );
}
