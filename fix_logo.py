import os

src_dir = 'src/components'

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.jsx', '.js')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Remove imports
            new_lines = []
            for line in content.split('\n'):
                if 'import jdcaLogo' in line and 'jdca-logo.png' in line:
                    continue
                new_lines.append(line)
                
            content = '\n'.join(new_lines)
            
            # Replace usages
            content = content.replace('{jdcaLogo}', '"/jdca-logo.png"')
            content = content.replace('jdcaLogo', '"/jdca-logo.png"')
            content = content.replace('{jdcaLogoUrl}', '"/jdca-logo.png"')
            content = content.replace('jdcaLogoUrl', '"/jdca-logo.png"')
            
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Updated {filepath}')
