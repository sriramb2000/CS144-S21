build: ComputeSHA.java
	javac ComputeSHA.java

test-sample: sample-input.txt
	cp sample-input.txt testInput
	make test

test-large: build
	head -c 1G </dev/urandom > testInput
	make test

test: build
	java ComputeSHA testInput > actualOutput
	sha256sum testInput | cut -d " " -f 1  > expectedOutput
	diff expectedOutput actualOutput

clean:
	rm actualOutput expectedOutput