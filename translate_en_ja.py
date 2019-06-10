import sys
import googletrans

text = " ".join(sys.argv[1:])
text = text.replace("\\n", "\n")
tr = googletrans.Translator()
ja = tr.translate(text, src='en', dest='ja').text
bytestring = str(ja.encode('utf-8'))
splited = bytestring\
	.lstrip("b'")\
	.rstrip("'")\
	.replace("\\x", "%")\
	.replace("\n", "\\n")
print(splited, end = "")
