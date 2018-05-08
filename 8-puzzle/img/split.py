import cv2
import numpy as np

bg_delta = 0.1
min_area = 20 * 20

im = cv2.imread('numbers.jpg')
assert im is not None

hint_imwrite = cv2.imwrite
hint_imwrite = lambda path,im: print(path,im.shape)
hint_imwrite = lambda path,im: None


bgColor = im[0,0]
delta = 0.1
range = bgColor * (1 - bg_delta), bgColor * (1 + bg_delta)
field = cv2.inRange(im, *range)

w,h = field.shape[:2]
mask = np.zeros((w + 2,h + 2),dtype=np.uint8)
mask[1:1 + w,1:1 + h] = 255 - field
hint_imwrite('mask.png',mask)
hint_imwrite('field.png',field)

cv2.floodFill(field,mask,(0,0),128)
hint_imwrite('ffield.png',field)
mask = cv2.inRange(field,128,128)
hint_imwrite('x.png',mask)

_,contours,_ = cv2.findContours(mask,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)

index = 0
for c in contours:
	x,y,w,h = cv2.boundingRect(c)
	if w * h < min_area:
		continue
	index+=1
	cv2.imwrite('{}.png'.format(index),im[y:y + h,x:x + w])
	
