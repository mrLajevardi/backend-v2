#!/bin/bash

# Find all test files in the ./src directory and its subdirectories
for test_file in $(find ./src -name "*.spec.ts"); do
    # Check if the "afterAll" block is present in the test file
    if ! grep -q "afterAll(async () => { await module.close(); })" "$test_file"; then
        # Append the "afterAll" block after the "beforeEach" block
        sed -i'' -e '/beforeEach(async () => {/,/});/s|});|&\n\n  afterAll(async () => { await module.close(); });|' "$test_file"
        echo "Added 'afterAll' block to: $test_file"
    else
        echo "Already contains 'afterAll' block: $test_file"
    fi
done