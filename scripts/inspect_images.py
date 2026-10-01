import re, glob, os

for f in sorted(glob.glob('temp_apk_assets/*.html')):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
    bgs = re.findall(r'url\(["\']?([^"\'\)]+)["\']?\)', content)
    print(f'=== {f} ===')
    for s in srcs:
        print('  img src:', s[:90])
    for b in bgs:
        print('  bg url:', b[:90])
