from PIL import Image

def clean_and_compose():
    plane = Image.open('airplane_body.png').convert('RGBA')
    face = Image.open('pilot_head.png').convert('RGBA')
    
    # Scale face to fit the cockpit
    print(plane.width, plane.height)
    print(face.width, face.height)
    # The plane is probably 800x600, face is big.
    # Let's resize face to 25% of the plane height
    face_h = int(plane.height * 0.35)
    face_w = int(face.width * (face_h / face.height))
    face = face.resize((face_w, face_h))
    
    def remove_bg(img):
        data = img.getdata()
        new_data = []
        for item in data:
            # The checkerboard in screenshots usually alternates between #f0f0f0 and #cccccc
            r, g, b, a = item
            # Remove white, light grey, checkerboard areas
            if r > 180 and g > 180 and b > 180:
                # Also check standard web checkerboard (204, 204, 204)
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        return img

    plane = remove_bg(plane)
    face = remove_bg(face)
    
    # Let's crop empty transparent borders to avoid huge padding
    bg = Image.new('RGBA', plane.size, (0,0,0,0))
    bg.paste(plane, (0, 0), plane)
    
    # Cockpit is usually at X=40%, Y=20% from top in these red plane cartoons
    px = int(plane.width * 0.45)
    py = int(plane.height * 0.35) - face_h // 2
    
    bg.paste(face, (px, py), face)
    
    # Save the composite
    bg.save('aviaozinho.png')

clean_and_compose()
print("Success")
