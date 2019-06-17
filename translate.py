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

text_paragraph_wise = text.split("\n\n")

if args.ja_en:
	src = 'ja'
	dest = 'en'
	max_len = 2000
else:
	src = 'en'
	dest = 'ja'
	max_len = 5000

text_5000 = [""]
for d in text_paragraph_wise:
	if len(text_5000[-1]) + len(d) >= max_len:
		text_5000.append(d)
		continue
	text_5000[-1] += "\n\n" + d

text_5000_translated = []
for t in text_5000:
	text_5000_translated.append(tr.translate(t, src=src, dest=dest).text)

text_translated = "\n\n".join(text_5000_translated)
bytestring = str(text_translated.encode('utf-8'))\
	.lstrip("b'")\
	.rstrip("'")\
	.replace("\\xc2\\xa0", "")\
	.replace("\\x", "%")\
	.replace("\n", "\\n")\
	.replace("\\\\ ", "\\")
print(bytestring, end="")
