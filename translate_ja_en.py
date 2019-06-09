import sys
import googletrans

text = " ".join(sys.argv[1:])
tr = googletrans.Translator()
print(tr.translate(text, src='ja', dest='en').text, end = "")
