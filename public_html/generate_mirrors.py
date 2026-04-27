import os
import glob
from datetime import datetime
from bs4 import BeautifulSoup
from markdownify import markdownify as md

def clean_html(soup):
    # Elements to remove
    selectors_to_remove = [
        'nav', 'footer', 'script', 'style', 'noscript',
        '#global-preloader', '.mascot-door-loader', '#cursorDot', '#cursorRing', '#cursorFlashlight',
        '#konamiToast', '.konami-toast', '.easter-counter',
        '#scroll-arrow', '#floating-contact', '.mobile-drawer', '.mobile-overlay',
        '.grain', '.webgl-canvas', '.transition-stars', '.transition-warp-lines'
    ]
    
    for selector in selectors_to_remove:
        for element in soup.select(selector):
            element.decompose()
            
    # Also remove any hidden elements or SVGs used for visuals
    for svg in soup.find_all('svg'):
        svg.decompose()
        
    return soup

def generate_mirrors():
    base_dir = '.'
    html_files = glob.glob(f'{base_dir}/**/*.html', recursive=True)
    count = 0
    
    for filepath in html_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        soup = BeautifulSoup(content, 'html.parser')
        
        # Extract Meta
        title = soup.title.string if soup.title else "Untitled"
        desc_tag = soup.find('meta', attrs={'name': 'description'})
        description = desc_tag['content'] if desc_tag else ""
        
        # Clean HTML
        clean_soup = clean_html(soup)
        
        # We only want to convert the body content, if body exists
        body_content = str(clean_soup.body) if clean_soup.body else str(clean_soup)
        
        # Convert to Markdown
        markdown_content = md(body_content, heading_style="ATX").strip()
        
        # Prepare final MD
        url_path = filepath.replace('./', '').replace('.html', '.md')
        full_url = f"https://raberbelkacem.com/{url_path}"
        date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        final_md = f"---\nTitle: {title}\nDescription: {description}\nURL: {full_url}\nLast_Updated: {date_str}\n---\n\n{markdown_content}\n"
        
        # Save MD
        md_filepath = filepath.replace('.html', '.md')
        with open(md_filepath, 'w', encoding='utf-8') as f:
            f.write(final_md)
        
        print(f"Generated: {md_filepath}")
        count += 1
        
    print(f"\nTotal files converted: {count}")

if __name__ == '__main__':
    generate_mirrors()
