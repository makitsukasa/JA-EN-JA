import sys
import argparse
import googletrans

parser = argparse.ArgumentParser()
parser.add_argument("text", nargs='+')
parser.add_argument("--ja_en", action = "store_true")
parser.add_argument("--en_ja", action = "store_true")
args = parser.parse_args()

tr = googletrans.Translator()

text = " ".join(args.text)
text = text.replace("\\n", "\n")
if args.ja_en:
	text_translated = tr.translate(text, src='ja', dest='en').text
else:
	text_translated = tr.translate(text, src='en', dest='ja').text
bytestring = str(text_translated.encode('utf-8'))\
	.lstrip("b'")\
	.rstrip("'")\
	.replace("\\x", "%")\
	.replace("\n", "\\n")
print(bytestring, end = "")
