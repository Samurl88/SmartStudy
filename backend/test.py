import matplotlib.pyplot as plt  # these are the necessary header files required

import cv2

import argparse
import os
os.environ['KMP_DUPLICATE_LIB_OK']='True'

import easyocr

from pylab import rcParams

from IPython.display import Image



# reader = easyocr.Reader(['en'])
# result = reader.readtext("thing.jpeg", detail=0)
# print(result)
from PIL import Image
import pytesseract
# ap = argparse.ArgumentParser()
# ap.add_argument("-i", "--image",
#                 required=True,
#                 help="/")
# ap.add_argument("-p", "--pre_processor",
#                 default="thresh",
#                 help="the preprocessor usage")
# args = vars(ap.parse_args())

#We then read the image with text
images = cv2.imread("IMG_3416.jpeg")

#convert to grayscale image
gray = cv2.cvtColor(images, cv2.COLOR_BGR2GRAY)

#checking whether thresh or blur]
cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
cv2.medianBlur(gray, 3)

#memory usage with image i.e. adding image to memory
filename = "{}.jpg".format(os.getpid())
cv2.imwrite(filename, gray)

thing = pytesseract.image_to_string(Image.open(filename))
print(thing)