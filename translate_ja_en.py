import sys
import googletrans

text = " ".join(sys.argv[1:])
text = text.replace("\\n", "\n")
tr = googletrans.Translator()
text_en = tr.translate(text, src='ja', dest='en').text
text_en = text_en.replace("\n", "\\n")
print(text_en, end = "")
