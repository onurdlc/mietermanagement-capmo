import fs from 'fs';
import path from 'path';

export default function DemoPage() {
  const html = fs.readFileSync(path.join(process.cwd(), 'public', 'index.html'), 'utf8');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
