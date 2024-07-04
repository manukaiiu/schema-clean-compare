** PURPOSE:
Comparing to sql schemas. 
But there might be hundreds of diffs you don't want to see.
So this mini tool removes lines that start with a predefined set of strings.
And then opens a code diff.

** HOW TO USE:
1. Get the Repo; Have Git, Node and VSCode installed
2. Copy both <file1>.sql and <file2>.sql to the input folder.
3. Optional: Adjust lineStartersToFilter in compare.js
4. Run "node compare.js <file1> <file2>".
5. Enjoy the cleaned up git diff in VSCode.