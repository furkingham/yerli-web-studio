import cv2
import numpy as np

# Load the image
img_path = r"C:\Users\Furkan\.gemini\antigravity\brain\5e7c009f-2d96-4377-8f5d-2203ae2f93ae\.user_uploaded\media_1788707831539.jpg"
out_path = r"C:\Users\Furkan\Desktop\yerli-web-studio\public\kaswa-logo-v2.png"

img = cv2.imread(img_path)

if img is None:
    print("Error: Image not found.")
    exit(1)

# Create a mask for near-black pixels
# Threshold can be adjusted (e.g. 0-25 for near black)
lower_black = np.array([0, 0, 0])
upper_black = np.array([25, 25, 25])

mask = cv2.inRange(img, lower_black, upper_black)

# Change the black pixels to #db0000 (BGR format: [0, 0, 219])
img[mask > 0] = [0, 0, 219]

# Save the processed image
cv2.imwrite(out_path, img)
print("Image processed and saved to", out_path)
