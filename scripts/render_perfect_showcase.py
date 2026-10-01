import os
import subprocess
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')
TEMP_DIR = os.path.join(BASE_DIR, 'temp_apk_assets')

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

screens = [
    ('loading_screen.html', 'loading_screenshot.webp'),
    ('home_screen.html', 'home_screenshot.webp'),
    ('explore_search_screen.html', 'explore_search_screenshot.webp'),
    ('play_protect_screen.html', 'security_scan_screenshot.webp'),
    ('player_screen.html', 'player_screenshot.webp'),
    ('livetv_screen.html', 'livetv_screenshot.webp'),
]

def render_screens():
    for html_file, webp_out in screens:
        html_path = os.path.join(TEMP_DIR, html_file)
        temp_png = os.path.join(TEMP_DIR, html_file.replace('.html', '_render.png'))
        file_url = 'file:///' + os.path.abspath(html_path).replace('\\', '/')

        cmd = [
            CHROME_PATH,
            '--headless=new',
            '--disable-gpu',
            '--hide-scrollbars',
            '--window-size=412,892',
            '--force-device-scale-factor=2',
            f'--screenshot={temp_png}',
            file_url
        ]
        print(f"Rendering: {html_file} -> {temp_png}")
        subprocess.run(cmd, check=True)

        # Convert to WebP high quality
        with Image.open(temp_png) as img:
            rgb_img = img.convert('RGB')
            # Ensure exact target resolution (824, 1784)
            if rgb_img.size != (824, 1784):
                rgb_img = rgb_img.resize((824, 1784), Image.Resampling.LANCZOS)
            
            dest_webp = os.path.join(ASSETS_DIR, webp_out)
            rgb_img.save(dest_webp, 'WEBP', quality=95, method=6)
            print(f"Saved: {dest_webp} {rgb_img.size} ({os.path.getsize(dest_webp)} bytes)")

    print("\nALL 6 SCREENS SUCCESSFULLY RENDERED AND OPTIMIZED!")

if __name__ == '__main__':
    render_screens()
