#  Postfix++ Interpreter (JavaScript)

A command-line **Postfix (Reverse Polish Notation) calculator** with **variable support (A–Z)**, written in JavaScript. It evaluates expressions like `3 4 +` and extends standard postfix by allowing **assignment**, **deletion**, and **versioned values per variable** using a simple hash table with chaining. Built as part of an algorithms & data structures coursework.

**Demo:** https://www.youtube.com/watch?v=3xDADdOe0yE

---

## Overview

The interpreter scans tokens left-to-right, pushing operands to a **stack**. When it encounters an operator, it pops the top two operands, applies the operator, then pushes the result back.  
Postfix++ adds variables (`A`–`Z`) with assignment like `A 5 =`. Each variable can hold multiple historical values (e.g., `A0`, `A1`) accessible via an index.

---

## Features

- Postfix evaluation via a **stack**
- **Variables (A–Z)** with assignment and deletion
- **Versioned values** per variable (e.g., `A0`, `A1`)
- Helpful runtime checks (invalid tokens, insufficient operands, division by zero)
- Simple **Node.js** CLI REPL

---

## Supported Operators

| Category    | Operator(s)      | Example / Meaning                       |
|-------------|-------------------|-----------------------------------------|
| Arithmetic  | `+ - * / % ^`     | `3 4 +` → 7 ; `2 8 ^` → 256             |
| Roots/Logs  | `r` (root), `l`   | `A B r` → A^(1/B) ; `A B l` → log_A(B)  |
| Variables   | `=`               | `A 3 =` assigns 3 to `A`                |
| Deletion    | (see Usage)       | `A A -` removes all values under `A`    |
| Selection   | `A#`              | `A0`, `A1` select specific value        |

> Notes  
> • Tokens must be **space-separated**.  
> • Selection uses a zero-based index: `A0` is the oldest stored value.

---

## Data Structures

- **Stack** (LIFO): holds operands during evaluation.  
- **Hash Table** (26 buckets): maps `A`–`Z` to buckets.  
- **Linked List** (separate chaining): stores multiple values (versions) for a variable and handles collisions.

---

## Installation & Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/PostfixPlusPlus-JS.git
    ```

2. Change into the project folder:

    ```bash
    cd PostfixPlusPlus-JS
    ```

3. Run with Node.js:

    ```bash
    node postfix.js
    ```

---

## Usage

Enter postfix expressions at the prompt; type `exit` to quit.

**Examples**

```text
3 4 +
# result = 7
````

```text
A 5 =
# A = 5
```

```text
A 2 +
# result = 7
```

```text
A 8 =
# A now has two values [5, 8]
```

```text
A
# Variable "A" has values: 5 -> 8
# (Use A0 or A1 to select)
```

```text
A1 2 *
# result = 16
```

```text
A A -
# Removed all values under "A"
```

---

## How It Works (High Level)

1. **Tokenize** input on spaces.
2. **Classify** tokens (number, variable, indexed variable, operator).
3. **Evaluate**: push numbers/variables; for an operator, pop two operands, resolve values, compute, push result.
4. **Assign/Store**: `=` inserts into the hash table’s chain for that variable.
5. **Delete**: `A A -` removes a variable’s chain.
6. **Output**: when one value remains on the stack, print `result = …`.

---

## Files

* `postfix.js` — Node.js CLI interpreter and core data structures.
* `postfix.pseudo` — Pseudocode for the algorithm and structures.
* `CM2030_ADS_Keagan_Suah.pdf` — Coursework write-up and design notes.

```
```
