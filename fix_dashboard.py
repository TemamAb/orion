import re
import sys

with open('myneon/monitoring/production/PRODUCTIONDASHBOARD.HTML.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove ALL dollar amounts
content = re.sub(r'\$[0-9,]+(?:\.[0-9]+)?', '$0', content)
content = re.sub(r'\$[0-9]+\.[0-9]+', '$0', content)

# Remove ALL percentages (but keep 0%)
content = re.sub(r'[1-9][0-9]*%', '0%', content)
content = re.sub(r'\+[0-9]+\.[0-9]+%', '+0.0%', content)

# Fix specific patterns
content = content.replace('$123.91', '$0')
content = content.replace('$14.37', '$0')
content = content.replace('$18,466.12', '$0')
content = content.replace('$1,245.51', '$0')
content = content.replace('+18.2%', '+0.0%')
content = content.replace('8.6', '0.0')
content = content.replace('$1,250,000', '$0')
content = content.replace('842', '0')
content = content.replace('43.8x', '0.0x')
content = content.replace('$420.55', '$0')
content = content.replace('12', '0')
content = content.replace('4', '0')
content = content.replace('12ms', '0ms')
content = content.replace('3.2', '0.0')
content = content.replace('+0.0042', '+0.0000')
content = content.replace('4280', '0')
content = content.replace('+12.45%', '+0.00%')
content = content.replace('99.8%', '0.0%')
content = content.replace('142', '0')
content = content.replace('89', '0')
content = content.replace('$42.40', '$0')
content = content.replace('$89.10', '$0')
content = content.replace('$12.50', '$0')
content = content.replace('$33.08', '$0')
content = content.replace('$32.92', '$0')
content = content.replace('+0.032%', '+0.000%')
content = content.replace('42 Gwei', '0 Gwei')

# Fix status
content = content.replace('OPERATIONAL', 'INITIALIZING')
content = content.replace('High Efficiency', 'Idle')
content = content.replace('Optimal Velocity', 'No Activity')
content = content.replace('optimizing', 'idle')

# Aggressive replacement for any remaining numbers in metrics
content = re.sub(r'>\s*[1-9][0-9,\.]*\s*<', '>0<', content)
content = re.sub(r'>\s*\+[0-9][0-9,\.]*\s*<', '>+0<', content)

with open('myneon/monitoring/production/PRODUCTIONDASHBOARD.HTML.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Dashboard fixed!")
