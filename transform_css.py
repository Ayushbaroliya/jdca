import re

file_path = r'c:\Users\lenovo\Desktop\WEBBDEV\JDCA\src\try.md'
with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    css = f.read()

# Fix corrupted encoding
css = re.sub(r'[A-Za-z0-9\?]+={2,}', '======', css)
css = re.sub(r'A\\?A\?', '=', css)

# 1. Vibrant Sports Colors (Electric Indigo instead of Cobalt)
css = css.replace('--color-cobalt:      #2457D6;', '--color-cobalt:      #4F46E5; /* Indigo/Sports */')
css = css.replace('--jdca-cobalt: #2457D6;', '--jdca-cobalt: #4F46E5;')
# Update button background to gradient
css = re.sub(r'background-color:\s*#2457D6;', 'background: linear-gradient(135deg, #4F46E5, #06B6D4); border: none;', css)
css = css.replace('background: #2457D6;', 'background: linear-gradient(135deg, #4F46E5, #06B6D4); border: none;')
# Add glows to primary buttons
css = css.replace('.btn-primary {', '.btn-primary {\n  box-shadow: 0 8px 20px -6px rgba(79, 70, 229, 0.6);')

# 2. Bubbly/Touch-friendly Geometry
css = css.replace('--radius-sm:  4px;', '--radius-sm:  8px;')
css = css.replace('--radius:     8px;', '--radius:     12px;')
css = css.replace('--radius-md:  10px;', '--radius-md:  16px;')
css = css.replace('--radius-lg:  12px;', '--radius-lg:  20px;')
css = css.replace('--radius-xl:  16px;', '--radius-xl:  24px;')

# Round out buttons and cards that have hardcoded radii
css = css.replace('border-radius: 4px;', 'border-radius: 8px;')
css = css.replace('border-radius: 5px;', 'border-radius: 10px;')
css = css.replace('border-radius: 6px;', 'border-radius: 12px;')
css = css.replace('border-radius: 7px;', 'border-radius: 12px;')
css = css.replace('border-radius: 8px;', 'border-radius: 14px;')
css = css.replace('border-radius: 9px;', 'border-radius: 14px;')
css = css.replace('border-radius: 10px;', 'border-radius: 16px;')
css = css.replace('border-radius: 11px;', 'border-radius: 16px;')
css = css.replace('border-radius: 12px;', 'border-radius: 20px;')

# 3. Strip Corporate Borders & Inject Glassmorphism Shadows
borders_to_soften = [
    '#dfe4ea', '#dfe4e8', '#e5e8ec', '#d5d9e0', '#cfd5db', '#cfd6df'
]
for b in borders_to_soften:
    css = css.replace(f'border: 1px solid {b};', 'border: 1px solid rgba(0,0,0,0.03); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.06);')
    css = css.replace(f'border:1px solid {b};', 'border:1px solid rgba(0,0,0,0.03); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.06);')

# Soften inner structural lines (e.g., table rows, section dividers)
inner_borders = [
    '#e8ebee', '#edf0f2', '#eef0f3', '#f0f2f4'
]
for b in inner_borders:
    css = css.replace(f'1px solid {b}', '1px solid rgba(0,0,0,0.02)')

# 4. Enhance Backgrounds
css = css.replace('background-color: #f8fafc;', 'background: radial-gradient(circle at top left, #ffffff, #f1f5f9);')
css = css.replace('background-color: #F7F8F4;', 'background: radial-gradient(circle at top left, #ffffff, #f1f5f9);')

with open(r'c:\Users\lenovo\Desktop\WEBBDEV\JDCA\src\index.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS successfully transformed!")
