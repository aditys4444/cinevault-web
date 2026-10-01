import os
import subprocess
import time
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')
TEMP_DIR = os.path.join(BASE_DIR, 'temp_apk_assets')

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

def render_html_to_png(html_path, out_png, width=412, height=915, scale=2):
    file_url = 'file:///' + os.path.abspath(html_path).replace('\\', '/')
    cmd = [
        CHROME_PATH,
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        f'--window-size={width},{height}',
        f'--force-device-scale-factor={scale}',
        f'--screenshot={out_png}',
        file_url
    ]
    print(f"Rendering {html_path} -> {out_png}")
    subprocess.run(cmd, check=True)

def process_all():
    # 1. Render loading_screen.html
    loading_html = os.path.join(TEMP_DIR, 'loading_screen.html')
    loading_png = os.path.join(TEMP_DIR, 'loading_screen.png')
    render_html_to_png(loading_html, loading_png, width=412, height=915, scale=2)
    
    img = Image.open(loading_png).convert('RGB')
    loading_webp = os.path.join(ASSETS_DIR, 'loading_screenshot.webp')
    img.save(loading_webp, 'WEBP', quality=95, method=6)
    print(f"Saved: {loading_webp} ({img.size})")

    # 2. Render play_protect_screen.html
    protect_html = os.path.join(TEMP_DIR, 'play_protect_screen.html')
    protect_png = os.path.join(TEMP_DIR, 'play_protect_screen.png')
    render_html_to_png(protect_html, protect_png, width=412, height=915, scale=2)

    img = Image.open(protect_png).convert('RGB')
    protect_webp = os.path.join(ASSETS_DIR, 'security_scan_screenshot.webp')
    img.save(protect_webp, 'WEBP', quality=95, method=6)
    print(f"Saved: {protect_webp} ({img.size})")

    # 3. Process real_cinevault_home.png -> home_screenshot.webp
    real_home_png = os.path.join(ASSETS_DIR, 'real_cinevault_home.png')
    img = Image.open(real_home_png).convert('RGB')
    target_size = (824, 1830)
    img_resized = img.resize(target_size, Image.Resampling.LANCZOS)
    home_webp = os.path.join(ASSETS_DIR, 'home_screenshot.webp')
    img_resized.save(home_webp, 'WEBP', quality=95, method=6)
    print(f"Saved: {home_webp} ({img_resized.size})")

    # 4. Process explore_search_screenshot.png -> explore_search_screenshot.webp
    real_search_png = os.path.join(ASSETS_DIR, 'explore_search_screenshot.png')
    img = Image.open(real_search_png).convert('RGB')
    img_resized = img.resize(target_size, Image.Resampling.LANCZOS)
    search_webp = os.path.join(ASSETS_DIR, 'explore_search_screenshot.webp')
    img_resized.save(search_webp, 'WEBP', quality=95, method=6)
    print(f"Saved: {search_webp} ({img_resized.size})")

    # 5. Process livetv_screenshot.png -> livetv_screenshot.webp
    real_livetv_png = os.path.join(ASSETS_DIR, 'livetv_screenshot.png')
    img = Image.open(real_livetv_png).convert('RGB')
    img_resized = img.resize(target_size, Image.Resampling.LANCZOS)
    livetv_webp = os.path.join(ASSETS_DIR, 'livetv_screenshot.webp')
    img_resized.save(livetv_webp, 'WEBP', quality=95, method=6)
    print(f"Saved: {livetv_webp} ({img_resized.size})")

    # 6. Process player_screenshot.png -> player_screenshot.webp
    real_player_png = os.path.join(ASSETS_DIR, 'player_screenshot.png')
    img = Image.open(real_player_png).convert('RGB')
    if img.size != target_size:
        img = img.resize(target_size, Image.Resampling.LANCZOS)
    player_webp = os.path.join(ASSETS_DIR, 'player_screenshot.webp')
    img.save(player_webp, 'WEBP', quality=95, method=6)
    print(f"Saved: {player_webp} ({img.size})")

    print("ALL 6 HIGH-DEFINITION SCREENSHOTS PROCESSED SUCCESSFULLY!")

if __name__ == '__main__':
    process_all()
