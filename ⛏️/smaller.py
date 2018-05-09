import cv2
import glob
import os

for f in glob.glob('*.png'):
	im = cv2.imread(f)
	#im = cv2.resize(im,(0,0),fx=.5,fy=.5,interpolation=cv2.INTER_AREA)
	cv2.imwrite(os.path.splitext(f)[0]+'.jpg',im)