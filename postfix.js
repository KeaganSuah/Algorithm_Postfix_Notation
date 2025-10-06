// Node & LinkedList classes Data Structure
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// Linkedlist class for seperate chaining collsion
class LinkedList {
  constructor() {
    this.head = null;
  }

  // To add value into the linked list
  append(value) {
    const newNode = new Node(value);
    if (this.head === null) {
      this.head = newNode;
      return;
    }
    let curr = this.head;
    while (curr.next) {
      curr = curr.next;
    }
    curr.next = newNode;
  }

  // Array of values in the linked list
  toArray() {
    const arr = [];
    let curr = this.head;
    while (curr) {
      arr.push(curr.value);
      curr = curr.next;
    }
    return arr;
  }

  // Print the values in the linked list
  printValues(key) {
    let curr = this.head;
    let chain = "";
    while (curr) {
      chain += curr.value;
      if (curr.next) {
        chain += " -> ";
      }
      curr = curr.next;
    }
    console.log(
      `Variable "${key}" has values: ${chain}, please index the value`
    );
  }
}

// HashTable class Data Structure
class HashTable {
  // create the hash table consisting of 26 buckets, each to store one letter in the alphabhat
  constructor() {
    this.buckets = new Array(26).fill(null);
    this.totalValues = 0;
  }

  // Get the index for of the key
  indexForKey(variableKey) {
    const offset = "A".charCodeAt(0);
    const index = variableKey.charCodeAt(0) - offset;
    return index;
  }

  // set the key with its values, multiple values will be stored chain together in the linked list
  set(variableKey, storedValue) {
    const i = this.indexForKey(variableKey);
    if (this.buckets[i] === null) {
      this.buckets[i] = new LinkedList();
    }
    this.buckets[i].append(storedValue);
    this.totalValues++;
  }

  // Get all the keys in the hashmap
  get_all_keys(variableKey) {
    const i = this.indexForKey(variableKey);
    const chain = this.buckets[i];
    if (chain === null) {
      return [];
    }
    return chain.toArray();
  }

  // Remove the key and all its linked list values
  removeKey(variableKey) {
    const i = this.indexForKey(variableKey);
    const chain = this.buckets[i];
    if (!chain) {
      return false;
    }
    const arr = chain.toArray();
    this.totalValues -= arr.length;
    this.buckets[i] = null;
    return true;
  }

  // Return the LinkedList object for a key
  getList(variableKey) {
    const i = this.indexForKey(variableKey);
    return this.buckets[i];
  }
}

// Stack class Data Structure
class Stack {
  constructor() {
    this.items = [];
  }
  // Insert element on the top of the stack
  push(el) {
    this.items.push(el);
  }
  // Remove the top element from the stack
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }
  // check if stack is empty
  isEmpty() {
    return this.items.length === 0;
  }
  // Get stack length
  size() {
    return this.items.length;
  }
}

// Check if token are in the correct integer format, including negative
function regex_check_integer(operand) {
  return /^-?\d+$/.test(operand);
}

// Check if token is in the correct key fomrat single-letter variable (e.g., A–Z)
function regex_check_key(operand) {
  return /^[A-Z]$/.test(operand);
}

// Check if token is a variable with index (e.g., "A0", "B2"), this will be for indexing the values in the linked list
function regex_check_key_index(operand) {
  return /^[A-Z]\d+$/.test(operand);
}

// check operand for integer or key, all else will be invalid
function validate_single_operand(operand) {
  // check and return integer
  if (regex_check_integer(operand)) {
    return operand;
  }

  // expected input from user would be the key with the index it wishes to get from the linked list (e.g. A1)
  if (regex_check_key_index(operand)) {
    // get the key value
    const key = operand.charAt(0);
    const index = parseInt(operand.slice(1), 10);
    // get a list of keys
    const values = Hashtable.get_all_keys(key);

    // If the hashtable returns nothing, this means the key doesn't exist
    if (values.length === 0) {
      console.log(`Variable "${key}" is not assigned`);
      return false;
    }

    // If the key only contain one value and there is no collision, and the user try to index the linked list
    if (values.length <= 1) {
      console.log(`Cannot index variable "${key}" with only one value`);
      return false;
    }

    // If the user type a index that doesn't exist in the linked list
    if (index < 0 || index >= values.length) {
      console.log(`Invalid index ${index} for variable "${key}"`);
      return false;
    }
    return values[index];
  }

  // If user return a variable key, get the value associated with the key, but if there is a collision, print out the linked list
  if (regex_check_key(operand)) {
    const values = Hashtable.get_all_keys(operand);
    // If the key cannot be found in the hashtable
    if (values.length === 0) {
      console.log(`Variable "${operand}" is not assigned`);
      return false;
    }
    // If there is a collision, it should be called with its index, without it will print the linked list
    if (values.length > 1) {
      const list = Hashtable.getList(operand);
      list.printValues(operand);
      return false;
    }
    // Return the value associated with the key
    return values[0];
  }

  console.log(`Invalid operand: "${operand}"`);
  return false;
}

// remove all values in the stack
function clear_stack() {
  while (!PostfixStack.isEmpty()) {
    PostfixStack.pop();
  }
}

// To check if the token provided is in the correct format for key deletion
function check_key_deletion(leftOperand) {
  // remove the key and all its values
  const removed = Hashtable.removeKey(leftOperand);
  if (removed) {
    console.log(`Removed all values under "${leftOperand}"`);
    return true;
  } else {
    console.log(`Variable "${leftOperand}" is not present`);
    return false;
  }
}

// Perform arithmetic operations and push result to stack
function perform_arithmetic(operator, leftOperand, rightOperand) {
  // Check if the operand inputs are valid, they may contain the variable, which will have to retrieve the value using the validate_single_operand
  const leftResolved = validate_single_operand(leftOperand);
  const rightResolved = validate_single_operand(rightOperand);
  // if both left and right operands are validate, continue with the calculation
  if (leftResolved && rightResolved) {
    const n1 = parseFloat(leftResolved);
    const n2 = parseFloat(rightResolved);
    // check the operator to peform the required tasks
    let result;
    // Switch between different operators
    switch (operator) {
      case "+":
        result = n1 + n2;
        break;
      case "-":
        result = n1 - n2;
        break;
      case "*":
        result = n1 * n2;
        break;
      case "/":
        if (n2 === 0) {
          console.log("Error: Division by zero");
          return false;
        }
        result = n1 / n2;
        break;
      case "%":
        if (n2 === 0) {
          console.log("Error: Modulo by zero");
          return false;
        }
        result = n1 % n2;
        break;
      case "^":
        result = Math.pow(n1, n2);
        break;
      case "r":
        result = Math.pow(n1, 1 / n2);
        break;
      case "l":
        if (n1 <= 0 || n1 === 1 || n2 <= 0) {
          console.log("Error: Invalid base or argument for logarithm");
          return false;
        }
        result = Math.log(n2) / Math.log(n1);
        break;
      default:
        console.log(`Invalid operator: "${operator}"`);
        return false;
    }

    // Add the results into the stack for multiple operators
    PostfixStack.push(result.toString());
  }
}

// Main evaluator, split into helper calls
function postfix_calculator(line) {
  // split the token into individual items based on spaces
  const tokens = line.trim().split(/\s+/);
  // Clear stack just in case there are left overs by previous
  clear_stack();

  // Check each token and see validate their value
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    // If the token is a operand, validate the value before pushing into stack
    if (
      regex_check_integer(token) ||
      regex_check_key(token) ||
      regex_check_key_index(token)
    ) {
      PostfixStack.push(token);
    } else {
      // If the token is operator, perform the task of checking if there is enough operands first
      if (PostfixStack.size() < 2) {
        console.log("Invalid input: not enough operands");
        return false;
      } else {
        // Pop the first two items in the stack to perform the arithmetic calculation
        const rightOperand = PostfixStack.pop();
        const leftOperand = PostfixStack.pop();
        // Check if they are variable assignment or deletion, otherwise the rest will be arithmetic calculations
        if (
          token === "-" &&
          regex_check_key(leftOperand) &&
          leftOperand === rightOperand
        ) {
          return check_key_deletion(leftOperand);
          // if operator is = sign, means user want to set a variable
        } else if (token === "=" && regex_check_integer(rightOperand)) {
          Hashtable.set(leftOperand, rightOperand);
          console.log(`${leftOperand} = ${rightOperand}`);
          return true;
          // Otherwise, just perform the normal arithmetic calculation
        } else {
          perform_arithmetic(token, leftOperand, rightOperand);
        }
      }
    }
  }

  // Final result will be the last item in the stack
  if (PostfixStack.size() === 1) {
    const finalResult = parseFloat(PostfixStack.pop());
    console.log(`result = ${finalResult}`);
  }
}

// Get the hashtable and stack
const PostfixStack = new Stack();
const Hashtable = new HashTable();

console.log(
  "┌─────────────────┬────────┬────────────────────────────────────────────────────┐\n" +
    "| Operation       | Symbol | Example                                            |\n" +
    "|-----------------|--------|----------------------------------------------------|\n" +
    "| Addition        | +      | 'A B +' means A + B                                |\n" +
    "| Subtraction     | -      | 'A B -' means A - B                                |\n" +
    "| Multiplication  | *      | 'A B *' means A * B                                |\n" +
    "| Division        | /      | 'A B /' means A / B                                |\n" +
    "| Modulus         | %      | 'A B %' means A % B                                |\n" +
    "| Power           | ^      | 'A B ^' means A raised to the power of B           |\n" +
    "| Root            | r      | 'A B r' means the (1/B)th power of A               |\n" +
    "| Logarithm       | l      | 'A B l' means log of B with base A                 |\n" +
    "|-----------------|--------|----------------------------------------------------|\n" +
    "| Assignment      | =      | 'A 3 =' assigns the value 3 to variable A          |\n" +
    "| Deletion        | -      | 'A A -' removes all values under A                 |\n" +
    "| SelectValue     | A#     | Use A0/A1 to pick specific value from list         |\n" +
    "|-----------------|--------|----------------------------------------------------|\n" +
    "| Exit            | exit   | Type 'exit' to quit interpreter                    |\n" +
    "└─────────────────┴────────┴────────────────────────────────────────────────────┘\n"
);

// required to read user input in javascript
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// get user input functions
function get_input() {
  // prompt the user to enter the postfix
  rl.question("Enter postfix: ", (userEnter) => {
    const input = userEnter.trim();
    // when user type exit, it will stop the application
    if (input.toLowerCase() === "exit") {
      console.log("Exiting Postfix++ Interpreter.");
      rl.close();
      return;
    }
    // as long as the input is not empty, it will process the input
    if (input !== "") {
      postfix_calculator(input);
    }
    get_input();
  });
}

get_input();
