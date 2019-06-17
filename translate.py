import sys
import re
import argparse
import googletrans

parser = argparse.ArgumentParser()
parser.add_argument("text", nargs='+')
parser.add_argument("--ja_en", action = "store_true")
parser.add_argument("--en_ja", action = "store_true")
args = parser.parse_args()

tr = googletrans.Translator()

ESCAPED_INDICATOR = "REGEX_ESCAPE_"
ESCAPE_REGEX = [re.compile(r"\$[^\$]*\$")]
escaped_count = 0
escaped_strings = []

text = " ".join(args.text)
text = text.replace("\\n", "\n")

for regex in ESCAPE_REGEX:
	while True:
		result = re.search(regex, text)
		if not result:
			break
		escaped_strings.append(result.group())
		text = re.sub(regex, ESCAPED_INDICATOR + str(escaped_count), text, 1)
		escaped_count += 1

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

for i in range(escaped_count):
	# print(escaped_strings[i], file = sys.stderr)
	text_translated = text_translated.replace(ESCAPED_INDICATOR + str(i), escaped_strings[i])
	# print(text, file = sys.stderr)

bytestring = str(text_translated.encode('utf-8'))\
	.lstrip("b'")\
	.rstrip("'")\
	.replace("\\xc2\\xa0", "")\
	.replace("\\x", "%")\
	.replace("\n", "\\n")\
	.replace("\\\\", "\\")\
	.replace("\\ ", "\\")
print(bytestring, end="")
