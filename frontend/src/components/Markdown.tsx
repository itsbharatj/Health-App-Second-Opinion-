interface MarkdownProps {
  content: string;
}

const Markdown = ({ content }: MarkdownProps) => {
  const renderMarkdown = (text: string) => {
    let html = text;

    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.+?)`/g, '<code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>');
    
    const lines = html.split('\n');
    const processed: string[] = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      if (line.match(/^#{1,6}\s/)) {
        const level = line.match(/^#+/)?.[0].length || 1;
        const text = line.replace(/^#+\s/, '');
        processed.push(`<h${level} style="font-weight: 700; margin: 12px 0 8px 0; color: #1f2937;">${text}</h${level}>`);
      }
      else if (line.match(/^[\*\-]\s/)) {
        if (!inList) {
          processed.push('<ul style="margin: 8px 0; padding-left: 24px;">');
          inList = true;
        }
        const text = line.replace(/^[\*\-]\s/, '');
        processed.push(`<li style="margin: 4px 0;">${text}</li>`);
      }
      else if (line.match(/^\d+\.\s/)) {
        if (!inList) {
          processed.push('<ol style="margin: 8px 0; padding-left: 24px;">');
          inList = true;
        }
        const text = line.replace(/^\d+\.\s/, '');
        processed.push(`<li style="margin: 4px 0;">${text}</li>`);
      }
      else {
        if (inList) {
          processed.push('</ul>');
          inList = false;
        }
        if (line.trim()) {
          processed.push(`<p style="margin: 8px 0; line-height: 1.6;">${line}</p>`);
        } else {
          processed.push('<br/>');
        }
      }
    }
    
    if (inList) {
      processed.push('</ul>');
    }
    
    return processed.join('');
  };

  return (
    <div 
      style={{ fontSize: '15px', color: '#374151' }}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

export default Markdown;
