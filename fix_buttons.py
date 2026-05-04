import os
import re

directory = 'src'

# We want to replace `bg-primary` with `bg-cta` and `hover:bg-primary-dark` with `hover:bg-cta-dark`
# but ONLY for CTA buttons like Submit, Book Appointment, Login, Generate, etc.
# Actually, since all these buttons with `bg-primary text-white` in forms/links are CTAs, we can just replace them.
# The only exceptions are `bg-primary` used in structural divs (like `className="bg-primary ... py-10"`), floating buttons, numbers, etc.
# We can just target any `bg-primary text-white` that also has `hover:bg-primary-dark` since that is specifically for interactive buttons.

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            # If the file contains `hover:bg-primary-dark`, it's almost certainly a button.
            # We replace `bg-primary` with `bg-cta` and `hover:bg-primary-dark` with `hover:bg-cta-dark`
            # Wait, what if it's the `Navbar.jsx` patient login button? It uses `bg-cta` already if I updated it, but if it reverted, it uses `bg-primary`.
            
            # Let's just do a regex replace for button classes:
            # specifically targeting `bg-primary` ... `hover:bg-primary-dark`
            
            # Let's replace 'bg-primary text-white' -> 'bg-cta text-white'
            # and 'hover:bg-primary-dark' -> 'hover:bg-cta-dark'
            # ONLY inside `<button` or `<Link` tags!
            
            def replace_in_tag(match):
                tag = match.group(0)
                # But wait, we shouldn't replace it if it's the floating chat button in Home.jsx, which we want as Orange too? Yes, Orange is great for chat!
                tag = tag.replace('bg-primary', 'bg-cta').replace('hover:bg-primary-dark', 'hover:bg-cta-dark')
                # Also replace `border-primary` with `border-cta` if any
                tag = tag.replace('border-primary', 'border-cta')
                return tag

            new_content = re.sub(r'<(button|Link)[^>]+>', replace_in_tag, content)
            
            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
