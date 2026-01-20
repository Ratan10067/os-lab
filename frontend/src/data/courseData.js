// Complete OS Lab Course Curriculum - Basics to Advanced
export const courses = [
  {
    id: "linux-basics",
    title: "Linux Fundamentals",
    description: "Master essential Linux commands and shell basics",
    icon: "Terminal",
    color: "emerald",
    duration: "2 hours",
    level: "Beginner",
    lessons: [
      {
        id: "introduction",
        title: "Introduction to Linux",
        description: "What is Linux and why use it?",
        duration: "5 min",
        theory: `# Introduction to Linux

Linux is a free, open-source operating system kernel created by Linus Torvalds in 1991.

## Why Linux?
- **Open Source** - Free to use, modify, and distribute
- **Secure** - Strong permission system and fewer viruses
- **Stable** - Runs for years without rebooting
- **Powerful** - Full control over the system
- **Industry Standard** - Used by 96% of web servers

## Linux Distributions
Popular distros include:
- Ubuntu - Beginner friendly
- Debian - Stable and reliable
- CentOS/RHEL - Enterprise servers
- Arch Linux - Advanced users

## The Shell
The shell is a command-line interface to interact with Linux.
\`\`\`bash
$ echo "Hello, Linux!"
Hello, Linux!
\`\`\``,
        commands: ["echo"],
        challenge: "Type 'echo Hello World' to print your first message.",
        hint: "Just type: echo Hello World"
      },
      {
        id: "navigation",
        title: "Filesystem Navigation",
        description: "Navigate the Linux directory structure",
        duration: "10 min",
        theory: `# Filesystem Navigation

## Linux Directory Structure
\`\`\`
/           # Root directory
├── home/   # User home directories
├── etc/    # Configuration files
├── var/    # Variable data (logs, cache)
├── tmp/    # Temporary files
├── usr/    # User programs
└── bin/    # Essential binaries
\`\`\`

## pwd - Print Working Directory
\`\`\`bash
$ pwd
/home/user
\`\`\`

## ls - List Directory Contents
\`\`\`bash
$ ls         # Simple list
$ ls -l      # Long format with details
$ ls -la     # Include hidden files
$ ls -lh     # Human-readable sizes
\`\`\`

## cd - Change Directory
\`\`\`bash
$ cd /tmp     # Absolute path
$ cd ..       # Parent directory
$ cd ~        # Home directory
$ cd -        # Previous directory
\`\`\``,
        commands: ["pwd", "ls", "ls -la", "cd"],
        challenge: "Find your current directory, list all files including hidden ones, then navigate to home.",
        hint: "Use pwd, then ls -la, then cd ~"
      },
      {
        id: "file-operations",
        title: "File Operations",
        description: "Create, view, and manipulate files",
        duration: "12 min",
        theory: `# File Operations

## Creating Files
\`\`\`bash
$ touch file.txt              # Create empty file
$ echo "Hello" > file.txt     # Create with content
$ echo "World" >> file.txt    # Append to file
\`\`\`

## Viewing Files
\`\`\`bash
$ cat file.txt       # Display entire file
$ head -n 5 file.txt # First 5 lines
$ tail -n 5 file.txt # Last 5 lines
$ less file.txt      # Scrollable view
\`\`\`

## Copying, Moving, Deleting
\`\`\`bash
$ cp source.txt dest.txt       # Copy file
$ cp -r dir1 dir2              # Copy directory
$ mv old.txt new.txt           # Rename/move
$ rm file.txt                  # Delete file
$ rm -rf directory             # Delete directory
\`\`\`

## File Information
\`\`\`bash
$ file document.pdf   # File type
$ stat file.txt       # Detailed info
$ wc -l file.txt      # Count lines
\`\`\``,
        commands: ["touch", "echo", "cat", "head", "tail", "cp", "mv", "rm"],
        challenge: "Create 'test.txt' with 'Hello World', view it, then rename to 'hello.txt'.",
        hint: "echo 'Hello World' > test.txt && cat test.txt && mv test.txt hello.txt"
      },
      {
        id: "directories",
        title: "Directory Management",
        description: "Create and organize directories",
        duration: "8 min",
        theory: `# Directory Management

## Creating Directories
\`\`\`bash
$ mkdir mydir                  # Single directory
$ mkdir -p a/b/c               # Nested directories
$ mkdir dir1 dir2 dir3         # Multiple at once
\`\`\`

## Removing Directories
\`\`\`bash
$ rmdir emptydir               # Empty directory only
$ rm -r mydir                  # With contents
$ rm -rf mydir                 # Force (careful!)
\`\`\`

## Directory Navigation Tips
\`\`\`bash
$ pushd /tmp      # Save current, go to /tmp
$ popd            # Return to saved directory
$ dirs            # Show directory stack
\`\`\`

## Viewing Structure
\`\`\`bash
$ tree             # Visual tree
$ tree -L 2        # Limit depth
$ ls -R            # Recursive listing
\`\`\``,
        commands: ["mkdir", "mkdir -p", "rmdir", "rm -r", "tree"],
        challenge: "Create nested directories: project/src/components, then verify with ls -R.",
        hint: "mkdir -p project/src/components && ls -R project"
      },
      {
        id: "permissions",
        title: "File Permissions",
        description: "Control access to files and directories",
        duration: "15 min",
        theory: `# File Permissions

## Understanding Permissions
\`\`\`
-rw-r--r-- 1 user group 1234 Jan 20 file.txt
 │││ │││ │││
 │││ │││ └── Others (r--)
 │││ └───── Group (r--)
 └──────── Owner (rw-)
\`\`\`

## Permission Values
| Symbol | Value | Meaning |
|--------|-------|---------|
| r | 4 | Read |
| w | 2 | Write |
| x | 1 | Execute |

## chmod - Change Permissions
\`\`\`bash
$ chmod 755 script.sh    # rwxr-xr-x
$ chmod 644 file.txt     # rw-r--r--
$ chmod +x script.sh     # Add execute
$ chmod -w file.txt      # Remove write
$ chmod u+x,g-w file     # Symbolic mode
\`\`\`

## chown - Change Owner
\`\`\`bash
$ chown user file.txt
$ chown user:group file.txt
$ chown -R user directory
\`\`\``,
        commands: ["ls -l", "chmod", "chmod 755", "chmod +x"],
        challenge: "Create a file, make it executable by everyone (755).",
        hint: "touch script.sh && chmod 755 script.sh && ls -l script.sh"
      },
      {
        id: "wildcards",
        title: "Wildcards and Patterns",
        description: "Match multiple files with patterns",
        duration: "10 min",
        theory: `# Wildcards and Patterns

## Common Wildcards
| Pattern | Matches |
|---------|---------|
| * | Any characters |
| ? | Single character |
| [abc] | a, b, or c |
| [0-9] | Any digit |
| [!abc] | Not a, b, or c |

## Examples
\`\`\`bash
$ ls *.txt           # All .txt files
$ ls file?.txt       # file1.txt, fileA.txt
$ ls file[0-9].txt   # file0.txt to file9.txt
$ rm *.log           # Delete all logs
$ cp *.jpg images/   # Copy all images
\`\`\`

## Brace Expansion
\`\`\`bash
$ touch file{1,2,3}.txt    # file1.txt file2.txt file3.txt
$ mkdir dir{A..E}          # dirA dirB dirC dirD dirE
$ echo {1..10}             # 1 2 3 4 5 6 7 8 9 10
\`\`\``,
        commands: ["ls *.txt", "rm *.log"],
        challenge: "Create file1.txt, file2.txt, file3.txt using brace expansion, then list them.",
        hint: "touch file{1,2,3}.txt && ls file*.txt"
      }
    ]
  },
  {
    id: "process-management",
    title: "Process Management",
    description: "Control and monitor system processes",
    icon: "Cpu",
    color: "blue",
    duration: "2.5 hours",
    level: "Intermediate",
    lessons: [
      {
        id: "viewing-processes",
        title: "Viewing Processes",
        description: "Monitor running processes",
        duration: "12 min",
        theory: `# Viewing Processes

## ps - Process Status
\`\`\`bash
$ ps              # Your processes
$ ps aux          # All processes
$ ps -ef          # Full format
$ ps aux | grep nginx  # Filter
\`\`\`

## Understanding Output
\`\`\`
USER  PID %CPU %MEM  VSZ  RSS TTY STAT TIME COMMAND
root    1  0.0  0.1 8536 4200 ?   Ss   0:01 /sbin/init
\`\`\`

## top - Real-time Monitor
\`\`\`bash
$ top             # Live view
$ top -u user     # Filter by user
\`\`\`
Keys: q=quit, k=kill, r=renice, M=sort by memory

## htop - Enhanced Monitor
\`\`\`bash
$ htop            # Interactive view
\`\`\``,
        commands: ["ps", "ps aux", "top"],
        challenge: "List all processes, then open top and exit with 'q'.",
        hint: "ps aux, then top, press q to exit"
      },
      {
        id: "background-jobs",
        title: "Background Jobs",
        description: "Run processes in background",
        duration: "10 min",
        theory: `# Background Jobs

## Running in Background
\`\`\`bash
$ sleep 100 &        # Start in background
$ command &          # & means background
\`\`\`

## Job Control
\`\`\`bash
$ jobs               # List background jobs
$ fg %1              # Bring job 1 to foreground
$ bg %1              # Send to background
$ disown %1          # Detach from terminal
\`\`\`

## Keyboard Shortcuts
- **Ctrl+C** - Kill foreground process
- **Ctrl+Z** - Suspend to background
- **Ctrl+D** - End of input

## nohup - Keep Running
\`\`\`bash
$ nohup command &    # Survives logout
$ nohup ./script.sh > output.log 2>&1 &
\`\`\``,
        commands: ["sleep 10 &", "jobs", "fg", "bg"],
        challenge: "Start 'sleep 60 &', list jobs, bring to foreground.",
        hint: "sleep 60 & then jobs then fg %1"
      },
      {
        id: "signals",
        title: "Signals and Kill",
        description: "Control processes with signals",
        duration: "12 min",
        theory: `# Signals and Kill

## Common Signals
| Signal | Number | Action |
|--------|--------|--------|
| SIGTERM | 15 | Graceful terminate |
| SIGKILL | 9 | Force kill |
| SIGHUP | 1 | Hangup/reload |
| SIGSTOP | 19 | Pause |
| SIGCONT | 18 | Continue |

## Sending Signals
\`\`\`bash
$ kill PID           # SIGTERM (15)
$ kill -9 PID        # SIGKILL (force)
$ kill -STOP PID     # Pause
$ kill -CONT PID     # Resume
$ killall nginx      # Kill by name
$ pkill -f pattern   # Kill by pattern
\`\`\`

## Finding Processes
\`\`\`bash
$ pgrep nginx        # Find PID by name
$ pidof nginx        # Get PID
\`\`\``,
        commands: ["kill", "kill -9", "killall", "pgrep"],
        challenge: "Start sleep 100 &, find its PID with ps, then kill it.",
        hint: "sleep 100 & then ps | grep sleep then kill <PID>"
      },
      {
        id: "priority",
        title: "Process Priority",
        description: "Control CPU scheduling priority",
        duration: "10 min",
        theory: `# Process Priority

## Nice Values
- Range: -20 (highest) to 19 (lowest)
- Default: 0
- Only root can set negative values

## Starting with Priority
\`\`\`bash
$ nice -n 10 command     # Low priority
$ nice -n -5 command     # High priority (root)
\`\`\`

## Changing Priority
\`\`\`bash
$ renice 10 -p PID       # Set nice to 10
$ renice -5 -p PID       # Higher priority
$ renice 15 -u username  # All user processes
\`\`\`

## Viewing Priority
\`\`\`bash
$ ps -l                  # Shows NI column
$ top                    # NI in display
\`\`\``,
        commands: ["nice", "renice", "ps -l"],
        challenge: "Start low-priority process: nice -n 19 sleep 60 &, verify with ps -l.",
        hint: "nice -n 19 sleep 60 & then ps -l"
      },
      {
        id: "process-states",
        title: "Process States",
        description: "Understanding process lifecycle",
        duration: "8 min",
        theory: `# Process States

## State Codes
| Code | State | Description |
|------|-------|-------------|
| R | Running | Currently executing |
| S | Sleeping | Waiting for event |
| D | Disk Sleep | Uninterruptible I/O |
| Z | Zombie | Terminated, not reaped |
| T | Stopped | Suspended |

## Process Creation
\`\`\`
Parent Process
     │
     └── fork() ──> Child Process
                         │
                         └── exec() ──> New Program
\`\`\`

## Viewing States
\`\`\`bash
$ ps aux           # STAT column
$ ps -eo pid,stat,comm
\`\`\``,
        commands: ["ps aux"],
        challenge: "View process states with ps aux, identify different state codes.",
        hint: "ps aux and look at STAT column"
      }
    ]
  },
  {
    id: "file-system",
    title: "File System Deep Dive",
    description: "Advanced file system operations and concepts",
    icon: "HardDrive",
    color: "purple",
    duration: "3 hours",
    level: "Intermediate",
    lessons: [
      {
        id: "links",
        title: "Links: Hard and Symbolic",
        description: "Create file links and shortcuts",
        duration: "12 min",
        theory: `# Links in Linux

## Hard Links
- Points to same inode (data)
- Cannot span filesystems
- File persists until all links deleted

\`\`\`bash
$ ln original.txt hardlink.txt
$ ls -li  # Same inode number
\`\`\`

## Symbolic (Soft) Links
- Points to filename (path)
- Can span filesystems
- Breaks if original deleted

\`\`\`bash
$ ln -s /path/to/original symlink
$ ls -l  # Shows -> target
\`\`\`

## Comparing Links
\`\`\`bash
$ stat original.txt    # Inode info
$ readlink symlink     # Show target
\`\`\``,
        commands: ["ln", "ln -s", "readlink"],
        challenge: "Create file original.txt, make hard and soft links, compare with ls -li.",
        hint: "touch original.txt && ln original.txt hard.txt && ln -s original.txt soft.txt && ls -li"
      },
      {
        id: "find-command",
        title: "Finding Files",
        description: "Search for files with find and locate",
        duration: "15 min",
        theory: `# Finding Files

## find Command
\`\`\`bash
$ find /path -name "*.txt"           # By name
$ find . -type f -size +1M           # Files > 1MB
$ find . -mtime -7                   # Modified in 7 days
$ find . -user root                  # Owned by root
$ find . -perm 755                   # By permissions
\`\`\`

## find with Actions
\`\`\`bash
$ find . -name "*.log" -delete       # Delete found
$ find . -type f -exec chmod 644 {} \\;  # Execute
$ find . -name "*.txt" -exec grep "text" {} +
\`\`\`

## locate - Fast Search
\`\`\`bash
$ locate filename        # Search database
$ updatedb               # Update database
\`\`\`

## which & whereis
\`\`\`bash
$ which python           # Command path
$ whereis python         # Binary, source, man
\`\`\``,
        commands: ["find", "locate", "which"],
        challenge: "Find all .txt files in current directory recursively.",
        hint: "find . -name '*.txt'"
      },
      {
        id: "disk-usage",
        title: "Disk Usage",
        description: "Monitor and analyze disk space",
        duration: "12 min",
        theory: `# Disk Usage

## df - Disk Free Space
\`\`\`bash
$ df              # All filesystems
$ df -h           # Human readable
$ df -T           # Show filesystem type
$ df /home        # Specific mount
\`\`\`

## du - Directory Usage
\`\`\`bash
$ du -sh *              # Summary each item
$ du -h --max-depth=1   # One level deep
$ du -ah | sort -rh | head -20  # Largest files
\`\`\`

## ncdu - Interactive
\`\`\`bash
$ ncdu /path      # Visual disk usage
\`\`\``,
        commands: ["df -h", "du -sh", "du -h --max-depth=1"],
        challenge: "Check disk space with df -h, then find largest items in current dir.",
        hint: "df -h then du -sh * | sort -rh"
      },
      {
        id: "compression",
        title: "Compression and Archives",
        description: "Compress and archive files",
        duration: "15 min",
        theory: `# Compression and Archives

## tar - Tape Archive
\`\`\`bash
# Create archive
$ tar -cvf archive.tar files/
$ tar -czvf archive.tar.gz files/  # With gzip

# Extract archive
$ tar -xvf archive.tar
$ tar -xzvf archive.tar.gz

# List contents
$ tar -tvf archive.tar
\`\`\`

## gzip and gunzip
\`\`\`bash
$ gzip file.txt          # Compress
$ gunzip file.txt.gz     # Decompress
$ gzip -k file.txt       # Keep original
\`\`\`

## zip
\`\`\`bash
$ zip archive.zip files/*
$ unzip archive.zip
$ unzip -l archive.zip   # List contents
\`\`\``,
        commands: ["tar -czvf", "tar -xzvf", "gzip", "zip", "unzip"],
        challenge: "Create a tar.gz archive of current directory, then extract to new folder.",
        hint: "tar -czvf backup.tar.gz . && mkdir extract && tar -xzvf backup.tar.gz -C extract"
      },
      {
        id: "inodes",
        title: "Inodes and Storage",
        description: "Understanding file system internals",
        duration: "10 min",
        theory: `# Inodes and Storage

## What is an Inode?
Data structure storing file metadata:
- File size
- Owner/group
- Permissions
- Timestamps
- Data block pointers

## Viewing Inodes
\`\`\`bash
$ ls -i file.txt         # Show inode number
$ stat file.txt          # Detailed info
$ df -i                  # Inode usage
\`\`\`

## Inode Exhaustion
A filesystem can run out of inodes before disk space!
\`\`\`bash
$ df -i                  # Check inode usage
\`\`\``,
        commands: ["ls -i", "stat", "df -i"],
        challenge: "View inode of a file with ls -i, then get detailed info with stat.",
        hint: "touch myfile && ls -i myfile && stat myfile"
      }
    ]
  },
  {
    id: "text-processing",
    title: "Text Processing",
    description: "Powerful text manipulation tools",
    icon: "FileText",
    color: "orange",
    duration: "3 hours",
    level: "Intermediate",
    lessons: [
      {
        id: "grep",
        title: "grep - Pattern Matching",
        description: "Search text with regular expressions",
        duration: "15 min",
        theory: `# grep - Global Regular Expression Print

## Basic Usage
\`\`\`bash
$ grep "pattern" file.txt
$ grep -i "pattern" file.txt    # Case insensitive
$ grep -r "pattern" directory/  # Recursive
$ grep -n "pattern" file.txt    # Line numbers
$ grep -c "pattern" file.txt    # Count matches
\`\`\`

## Inverse and Context
\`\`\`bash
$ grep -v "pattern" file.txt     # Not matching
$ grep -A 3 "pattern" file.txt   # 3 lines after
$ grep -B 3 "pattern" file.txt   # 3 lines before
$ grep -C 3 "pattern" file.txt   # 3 lines context
\`\`\`

## Regular Expressions
\`\`\`bash
$ grep "^start" file.txt         # Lines starting with
$ grep "end$" file.txt           # Lines ending with
$ grep -E "[0-9]+" file.txt      # Extended regex
\`\`\``,
        commands: ["grep", "grep -i", "grep -r", "grep -n"],
        challenge: "Create a file with text, then grep for a specific word.",
        hint: "echo -e 'hello world\\nfoo bar' > test.txt && grep 'hello' test.txt"
      },
      {
        id: "sed",
        title: "sed - Stream Editor",
        description: "Edit text streams and files",
        duration: "15 min",
        theory: `# sed - Stream Editor

## Substitution
\`\`\`bash
$ sed 's/old/new/' file.txt          # First occurrence
$ sed 's/old/new/g' file.txt         # All occurrences
$ sed -i 's/old/new/g' file.txt      # In-place edit
\`\`\`

## Delete Lines
\`\`\`bash
$ sed '3d' file.txt              # Delete line 3
$ sed '1,5d' file.txt            # Delete lines 1-5
$ sed '/pattern/d' file.txt     # Delete matching
\`\`\`

## Print Lines
\`\`\`bash
$ sed -n '5p' file.txt          # Print line 5
$ sed -n '1,10p' file.txt       # Print lines 1-10
$ sed -n '/pattern/p' file.txt  # Print matching
\`\`\``,
        commands: ["sed 's/old/new/'", "sed -i", "sed -n"],
        challenge: "Replace all 'foo' with 'bar' in a file.",
        hint: "echo 'foo foo foo' > test.txt && sed 's/foo/bar/g' test.txt"
      },
      {
        id: "awk",
        title: "awk - Text Processing",
        description: "Powerful pattern scanning language",
        duration: "18 min",
        theory: `# awk - Pattern Processing

## Basic Syntax
\`\`\`bash
$ awk '{print $1}' file.txt           # First column
$ awk '{print $1, $3}' file.txt       # Columns 1 and 3
$ awk -F: '{print $1}' /etc/passwd    # Custom delimiter
\`\`\`

## Patterns
\`\`\`bash
$ awk '/pattern/ {print}' file.txt   # Match pattern
$ awk '$3 > 100 {print}' file.txt    # Condition
$ awk 'NR==5 {print}' file.txt       # Line 5
\`\`\`

## Built-in Variables
- $0 - Entire line
- $1, $2... - Fields
- NR - Line number
- NF - Number of fields
- FS - Field separator

## Examples
\`\`\`bash
$ awk '{sum+=$1} END {print sum}' file.txt  # Sum column
$ awk 'NF > 0' file.txt                     # Non-empty lines
\`\`\``,
        commands: ["awk '{print $1}'", "awk -F:"],
        challenge: "Print the first and third columns of /etc/passwd separated by colon.",
        hint: "awk -F: '{print $1, $3}' /etc/passwd"
      },
      {
        id: "sort-uniq",
        title: "Sorting and Unique",
        description: "Sort and filter duplicate data",
        duration: "10 min",
        theory: `# sort and uniq

## sort Command
\`\`\`bash
$ sort file.txt              # Alphabetical
$ sort -n file.txt           # Numeric
$ sort -r file.txt           # Reverse
$ sort -k2 file.txt          # By column 2
$ sort -t: -k3 -n file.txt   # Custom delimiter
\`\`\`

## uniq Command
\`\`\`bash
$ uniq file.txt              # Remove adjacent duplicates
$ sort file.txt | uniq       # Remove all duplicates
$ uniq -c file.txt           # Count occurrences
$ uniq -d file.txt           # Only duplicates
\`\`\`

## Common Patterns
\`\`\`bash
$ sort file.txt | uniq -c | sort -rn   # Frequency count
$ cat access.log | cut -d' ' -f1 | sort | uniq -c | sort -rn
\`\`\``,
        commands: ["sort", "sort -n", "uniq", "uniq -c"],
        challenge: "Sort a file numerically and count unique occurrences.",
        hint: "echo -e '3\\n1\\n2\\n1\\n3\\n3' > nums.txt && sort -n nums.txt | uniq -c"
      },
      {
        id: "cut-paste",
        title: "Cut and Paste",
        description: "Extract and combine columns",
        duration: "8 min",
        theory: `# cut and paste

## cut Command
\`\`\`bash
$ cut -d: -f1 /etc/passwd         # Field 1, : delimiter
$ cut -d: -f1,3 /etc/passwd       # Fields 1 and 3
$ cut -c1-10 file.txt             # Characters 1-10
\`\`\`

## paste Command
\`\`\`bash
$ paste file1.txt file2.txt       # Side by side
$ paste -d, file1.txt file2.txt   # With comma
$ paste -s file.txt               # Serial (one line)
\`\`\`

## tr Command - Translate
\`\`\`bash
$ tr 'a-z' 'A-Z' < file.txt       # To uppercase
$ tr -d '0-9' < file.txt          # Delete digits
$ tr -s ' ' < file.txt            # Squeeze spaces
\`\`\``,
        commands: ["cut -d", "paste", "tr"],
        challenge: "Extract usernames from /etc/passwd (first field).",
        hint: "cut -d: -f1 /etc/passwd"
      }
    ]
  },
  {
    id: "shell-scripting",
    title: "Shell Scripting",
    description: "Automate tasks with bash scripts",
    icon: "Code",
    color: "cyan",
    duration: "4 hours",
    level: "Advanced",
    lessons: [
      {
        id: "script-basics",
        title: "Script Basics",
        description: "Your first shell script",
        duration: "12 min",
        theory: `# Shell Script Basics

## Creating a Script
\`\`\`bash
#!/bin/bash
# This is a comment
echo "Hello, World!"
\`\`\`

## Running Scripts
\`\`\`bash
$ chmod +x script.sh    # Make executable
$ ./script.sh           # Run
$ bash script.sh        # Or with bash
\`\`\`

## Variables
\`\`\`bash
name="John"
echo "Hello, $name"
echo "Hello, \${name}!"

# Command substitution
today=$(date)
echo "Today is $today"
\`\`\`

## Reading Input
\`\`\`bash
read -p "Enter name: " name
echo "Hello, $name"
\`\`\``,
        commands: ["chmod +x", "bash"],
        challenge: "Create a script that prints 'Hello from script!' and run it.",
        hint: "echo '#!/bin/bash\\necho Hello from script!' > hello.sh && chmod +x hello.sh && ./hello.sh"
      },
      {
        id: "conditionals",
        title: "Conditionals",
        description: "If-then-else logic",
        duration: "15 min",
        theory: `# Conditionals

## if Statement
\`\`\`bash
if [ condition ]; then
    commands
elif [ condition ]; then
    commands
else
    commands
fi
\`\`\`

## Test Operators
### File Tests
\`\`\`bash
[ -f file ]    # Is regular file
[ -d dir ]     # Is directory
[ -e path ]    # Exists
[ -r file ]    # Is readable
[ -w file ]    # Is writable
[ -x file ]    # Is executable
\`\`\`

### String Tests
\`\`\`bash
[ -z "$str" ]      # Is empty
[ -n "$str" ]      # Is not empty
[ "$a" = "$b" ]    # Are equal
[ "$a" != "$b" ]   # Are different
\`\`\`

### Numeric Tests
\`\`\`bash
[ $a -eq $b ]    # Equal
[ $a -ne $b ]    # Not equal
[ $a -lt $b ]    # Less than
[ $a -gt $b ]    # Greater than
\`\`\``,
        commands: ["if", "test"],
        challenge: "Write a script that checks if a file exists.",
        hint: "Create script with: if [ -f myfile ]; then echo 'exists'; else echo 'not found'; fi"
      },
      {
        id: "loops",
        title: "Loops",
        description: "Iterate with for and while",
        duration: "15 min",
        theory: `# Loops

## for Loop
\`\`\`bash
# List iteration
for item in one two three; do
    echo "$item"
done

# Range
for i in {1..10}; do
    echo "$i"
done

# C-style
for ((i=0; i<10; i++)); do
    echo "$i"
done

# Files
for file in *.txt; do
    echo "Processing $file"
done
\`\`\`

## while Loop
\`\`\`bash
count=1
while [ $count -le 5 ]; do
    echo "Count: $count"
    ((count++))
done

# Read file line by line
while read line; do
    echo "$line"
done < file.txt
\`\`\``,
        commands: ["for", "while"],
        challenge: "Write a loop that prints numbers 1 to 5.",
        hint: "for i in {1..5}; do echo $i; done"
      },
      {
        id: "functions",
        title: "Functions",
        description: "Create reusable code blocks",
        duration: "12 min",
        theory: `# Functions

## Defining Functions
\`\`\`bash
# Method 1
function greet {
    echo "Hello, $1!"
}

# Method 2
greet() {
    echo "Hello, $1!"
}
\`\`\`

## Parameters
\`\`\`bash
add() {
    local sum=$(($1 + $2))
    echo $sum
}
result=$(add 5 3)
echo "Sum: $result"
\`\`\`

## Return Values
\`\`\`bash
is_even() {
    if [ $(($1 % 2)) -eq 0 ]; then
        return 0  # True
    else
        return 1  # False
    fi
}

if is_even 4; then
    echo "Even"
fi
\`\`\``,
        commands: ["function"],
        challenge: "Create a function that takes a name and prints a greeting.",
        hint: "Create: greet() { echo \"Hello, $1!\"; } then call: greet World"
      },
      {
        id: "arrays",
        title: "Arrays",
        description: "Work with array data",
        duration: "10 min",
        theory: `# Arrays

## Creating Arrays
\`\`\`bash
# Indexed array
fruits=("apple" "banana" "cherry")

# Explicit indices
fruits[0]="apple"
fruits[1]="banana"
\`\`\`

## Accessing Elements
\`\`\`bash
echo \${fruits[0]}       # First element
echo \${fruits[@]}       # All elements
echo \${#fruits[@]}      # Array length
echo \${!fruits[@]}      # All indices
\`\`\`

## Iterating
\`\`\`bash
for fruit in "\${fruits[@]}"; do
    echo "$fruit"
done
\`\`\`

## Array Operations
\`\`\`bash
fruits+=("orange")       # Append
unset fruits[1]          # Remove index 1
\`\`\``,
        commands: ["declare -a"],
        challenge: "Create an array of 3 colors, then print them all.",
        hint: "colors=(red green blue) && echo \${colors[@]}"
      }
    ]
  },
  {
    id: "networking",
    title: "Networking Essentials",
    description: "Network configuration and troubleshooting",
    icon: "Network",
    color: "pink",
    duration: "2.5 hours",
    level: "Advanced",
    lessons: [
      {
        id: "network-info",
        title: "Network Information",
        description: "View network configuration",
        duration: "12 min",
        theory: `# Network Information

## IP Configuration
\`\`\`bash
$ ip addr             # Show IP addresses
$ ip link             # Show interfaces
$ ifconfig            # Legacy command
$ hostname -I         # Quick IP lookup
\`\`\`

## Routing
\`\`\`bash
$ ip route            # Routing table
$ route -n            # Legacy
$ traceroute host     # Path to destination
\`\`\`

## DNS
\`\`\`bash
$ cat /etc/resolv.conf   # DNS servers
$ nslookup google.com    # DNS lookup
$ dig google.com         # Detailed DNS
$ host google.com        # Simple lookup
\`\`\``,
        commands: ["ip addr", "ip route", "hostname"],
        challenge: "View your IP address and default gateway.",
        hint: "ip addr && ip route | grep default"
      },
      {
        id: "connectivity",
        title: "Testing Connectivity",
        description: "Ping and network diagnostics",
        duration: "10 min",
        theory: `# Testing Connectivity

## ping
\`\`\`bash
$ ping google.com         # Continuous ping
$ ping -c 4 google.com    # 4 packets only
$ ping -i 0.5 host        # 0.5s interval
\`\`\`

## traceroute
\`\`\`bash
$ traceroute google.com   # Path to host
$ mtr google.com          # Combined ping/trace
\`\`\`

## netstat / ss
\`\`\`bash
$ ss -tuln               # Listening ports
$ ss -tp                 # Established connections
$ netstat -an            # All connections
\`\`\``,
        commands: ["ping", "traceroute", "ss -tuln"],
        challenge: "Ping localhost 4 times and check listening ports.",
        hint: "ping -c 4 localhost && ss -tuln"
      },
      {
        id: "curl-wget",
        title: "HTTP Requests",
        description: "Download and test web resources",
        duration: "12 min",
        theory: `# HTTP Requests

## curl
\`\`\`bash
$ curl https://example.com          # Fetch URL
$ curl -o file.html URL             # Save to file
$ curl -I URL                       # Headers only
$ curl -X POST -d "data" URL        # POST request
$ curl -H "Header: value" URL       # Custom header
\`\`\`

## wget
\`\`\`bash
$ wget URL                  # Download file
$ wget -O name.html URL     # Save as name
$ wget -r URL               # Recursive download
$ wget -c URL               # Continue download
\`\`\`

## Practical Examples
\`\`\`bash
$ curl -s https://api.github.com/users/torvalds | jq
$ wget -q -O - URL          # Output to stdout
\`\`\``,
        commands: ["curl", "wget"],
        challenge: "Download the homepage of example.com with curl.",
        hint: "curl https://example.com"
      },
      {
        id: "ssh",
        title: "SSH - Secure Shell",
        description: "Remote server access",
        duration: "15 min",
        theory: `# SSH - Secure Shell

## Basic Connection
\`\`\`bash
$ ssh user@host            # Connect
$ ssh -p 2222 user@host    # Custom port
$ ssh user@host command    # Run remote command
\`\`\`

## SSH Keys
\`\`\`bash
$ ssh-keygen -t ed25519              # Generate key
$ ssh-copy-id user@host              # Copy to server
$ ssh -i ~/.ssh/key user@host        # Use specific key
\`\`\`

## SCP - Secure Copy
\`\`\`bash
$ scp file.txt user@host:/path       # Upload
$ scp user@host:/path/file.txt .     # Download
$ scp -r dir user@host:/path         # Directory
\`\`\`

## SSH Config (~/.ssh/config)
\`\`\`
Host myserver
    HostName 192.168.1.100
    User admin
    Port 22
    IdentityFile ~/.ssh/key
\`\`\``,
        commands: ["ssh", "scp", "ssh-keygen"],
        challenge: "Generate an SSH key pair (you can use a passphrase or leave empty).",
        hint: "ssh-keygen -t ed25519"
      }
    ]
  },
  {
    id: "system-admin",
    title: "System Administration",
    description: "Advanced system management skills",
    icon: "Settings",
    color: "red",
    duration: "4 hours",
    level: "Advanced",
    lessons: [
      {
        id: "user-management",
        title: "User Management",
        description: "Create and manage users",
        duration: "15 min",
        theory: `# User Management

## User Commands
\`\`\`bash
$ whoami              # Current user
$ id                  # User ID info
$ users               # Logged in users
$ who                 # Who is logged in
$ w                   # Users and activity
\`\`\`

## Creating Users
\`\`\`bash
$ useradd username              # Create user
$ useradd -m -s /bin/bash user  # With home, bash
$ passwd username               # Set password
\`\`\`

## Modifying Users
\`\`\`bash
$ usermod -aG group user   # Add to group
$ usermod -s /bin/zsh user # Change shell
$ userdel -r username      # Delete with home
\`\`\`

## Important Files
\`\`\`
/etc/passwd  - User accounts
/etc/shadow  - Encrypted passwords
/etc/group   - Groups
\`\`\``,
        commands: ["whoami", "id", "useradd", "passwd"],
        challenge: "Check your current user and their groups.",
        hint: "whoami && id"
      },
      {
        id: "services",
        title: "Service Management",
        description: "Control system services with systemd",
        duration: "15 min",
        theory: `# Service Management (systemd)

## systemctl Commands
\`\`\`bash
$ systemctl status nginx      # Service status
$ systemctl start nginx       # Start service
$ systemctl stop nginx        # Stop service
$ systemctl restart nginx     # Restart
$ systemctl reload nginx      # Reload config
\`\`\`

## Enable/Disable
\`\`\`bash
$ systemctl enable nginx      # Start on boot
$ systemctl disable nginx     # Don't start on boot
$ systemctl is-enabled nginx  # Check if enabled
\`\`\`

## Listing Services
\`\`\`bash
$ systemctl list-units --type=service
$ systemctl list-unit-files
\`\`\`

## Logs
\`\`\`bash
$ journalctl -u nginx         # Service logs
$ journalctl -f               # Follow logs
\`\`\``,
        commands: ["systemctl status", "systemctl start", "journalctl"],
        challenge: "List all running services on the system.",
        hint: "systemctl list-units --type=service --state=running"
      },
      {
        id: "cron",
        title: "Scheduled Tasks",
        description: "Automate with cron and at",
        duration: "15 min",
        theory: `# Scheduled Tasks

## Cron Syntax
\`\`\`
┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6)
│ │ │ │ │
* * * * * command
\`\`\`

## Examples
\`\`\`bash
0 * * * * /script.sh          # Every hour
0 0 * * * /script.sh          # Daily at midnight
0 0 * * 0 /script.sh          # Weekly on Sunday
*/5 * * * * /script.sh        # Every 5 minutes
\`\`\`

## Managing Crontab
\`\`\`bash
$ crontab -l          # List jobs
$ crontab -e          # Edit jobs
$ crontab -r          # Remove all
\`\`\`

## at - One-time Tasks
\`\`\`bash
$ at now + 5 minutes
at> /path/to/script.sh
at> Ctrl+D

$ atq               # List pending
$ atrm 1            # Remove job 1
\`\`\``,
        commands: ["crontab -l", "crontab -e", "at"],
        challenge: "View current user's cron jobs.",
        hint: "crontab -l"
      },
      {
        id: "logs",
        title: "System Logs",
        description: "Monitor and analyze logs",
        duration: "12 min",
        theory: `# System Logs

## Common Log Files
\`\`\`
/var/log/syslog     - General system log
/var/log/auth.log   - Authentication
/var/log/kern.log   - Kernel messages
/var/log/dmesg      - Boot messages
\`\`\`

## Viewing Logs
\`\`\`bash
$ tail -f /var/log/syslog     # Follow live
$ tail -n 100 /var/log/syslog # Last 100 lines
$ less /var/log/syslog        # Scrollable view
$ grep "error" /var/log/syslog
\`\`\`

## journalctl (systemd)
\`\`\`bash
$ journalctl                   # All logs
$ journalctl -f                # Follow
$ journalctl --since "1 hour ago"
$ journalctl -p err            # Errors only
$ journalctl -u nginx          # Service logs
\`\`\`

## dmesg - Kernel Messages
\`\`\`bash
$ dmesg                # All kernel messages
$ dmesg | tail         # Recent messages
$ dmesg -w             # Follow
\`\`\``,
        commands: ["tail -f", "journalctl", "dmesg"],
        challenge: "View the last 20 kernel messages.",
        hint: "dmesg | tail -20"
      },
      {
        id: "environment",
        title: "Environment Variables",
        description: "Configure the shell environment",
        duration: "10 min",
        theory: `# Environment Variables

## Viewing Variables
\`\`\`bash
$ env                  # All variables
$ printenv             # Same as env
$ echo $PATH           # Specific variable
$ echo $HOME $USER     # Multiple
\`\`\`

## Setting Variables
\`\`\`bash
# Temporary (current shell)
$ export MY_VAR="value"

# Permanent (add to ~/.bashrc)
export PATH="$PATH:/new/path"
export MY_VAR="value"

# Apply changes
$ source ~/.bashrc
\`\`\`

## Important Variables
\`\`\`bash
$HOME      # Home directory
$USER      # Current username
$PATH      # Executable search path
$SHELL     # Current shell
$PWD       # Current directory
$EDITOR    # Default editor
\`\`\``,
        commands: ["env", "export", "echo $PATH"],
        challenge: "Display all environment variables and check the PATH.",
        hint: "env && echo $PATH"
      }
    ]
  },
  {
    id: "advanced-os",
    title: "Advanced Operating Systems",
    description: "Deep dive into OS internals, memory management, CPU scheduling, and more",
    icon: "Cpu",
    color: "red",
    duration: "6 hours",
    level: "Advanced",
    premium: true,
    lessons: [
      {
        id: "os-architecture",
        title: "Operating System Architecture",
        description: "Kernel types, system calls, and OS structure",
        duration: "20 min",
        theory: `# Operating System Architecture

## What is an Operating System?
An OS is software that manages hardware resources and provides services for programs.

## OS Components
\`\`\`
┌─────────────────────────────────────┐
│         User Applications           │
├─────────────────────────────────────┤
│       System Libraries (libc)       │
├─────────────────────────────────────┤
│     System Call Interface           │
├─────────────────────────────────────┤
│           Kernel                    │
│  ┌─────────┬──────────┬──────────┐  │
│  │Process  │ Memory   │ File     │  │
│  │Manager  │ Manager  │ System   │  │
│  └─────────┴──────────┴──────────┘  │
│  ┌─────────┬──────────┬──────────┐  │
│  │I/O      │ Network  │ Device   │  │
│  │System   │ Stack    │ Drivers  │  │
│  └─────────┴──────────┴──────────┘  │
├─────────────────────────────────────┤
│            Hardware                 │
└─────────────────────────────────────┘
\`\`\`

## Kernel Types
1. **Monolithic Kernel** - All services in kernel space (Linux)
2. **Microkernel** - Minimal kernel, services in user space (Minix)
3. **Hybrid Kernel** - Combination (Windows NT, macOS)

## System Calls
Interface between user programs and kernel:
\`\`\`c
// Example: open() system call
int fd = open("/etc/passwd", O_RDONLY);
\`\`\`

## View System Calls
\`\`\`bash
$ strace ls           # Trace system calls
$ cat /proc/kallsyms  # Kernel symbols
$ uname -a            # System info
\`\`\``,
        commands: ["uname -a", "strace ls"],
        challenge: "View system information with uname -a and understand the output.",
        hint: "Run: uname -a"
      },
      {
        id: "process-internals",
        title: "Process Internals",
        description: "Process control block, states, and context switching",
        duration: "25 min",
        theory: `# Process Internals

## Process Control Block (PCB)
Each process has a PCB containing:
- Process ID (PID)
- Process State
- Program Counter
- CPU Registers
- Memory Management Info
- I/O Status Information
- Accounting Information

## Process States
\`\`\`
        ┌──────────┐
        │   New    │
        └────┬─────┘
             │ admitted
             ▼
        ┌──────────┐  interrupt   ┌──────────┐
  ○────▶│  Ready   │◀────────────│ Running  │
        └────┬─────┘              └────┬─────┘
             │ scheduler dispatch      │
             └─────────────────────────┘
             │                         │
             │ I/O or event wait       │ exit
             ▼                         ▼
        ┌──────────┐              ┌──────────┐
        │ Waiting  │              │Terminated│
        └──────────┘              └──────────┘
\`\`\`

## Context Switching
When CPU switches from one process to another:
1. Save state of current process
2. Load state of next process
3. Jump to next process code

## Viewing Process Info
\`\`\`bash
$ cat /proc/self/status  # Current process info
$ cat /proc/1/status     # Init process info
$ ps -eo pid,ppid,state,cmd
\`\`\`

## Process Memory Layout
\`\`\`
High Address ─────────────────
              │   Stack     │ ↓ grows down
              ├─────────────┤
              │    ...      │
              ├─────────────┤
              │   Heap      │ ↑ grows up
              ├─────────────┤
              │    BSS      │ Uninitialized data
              ├─────────────┤
              │   Data      │ Initialized data
              ├─────────────┤
              │   Text      │ Code
Low Address  ─────────────────
\`\`\``,
        commands: ["cat /proc/self/status", "ps -eo pid,ppid,state,cmd"],
        challenge: "View the status of the current shell process using /proc.",
        hint: "cat /proc/self/status"
      },
      {
        id: "cpu-scheduling",
        title: "CPU Scheduling Algorithms",
        description: "FCFS, SJF, Round Robin, Priority scheduling",
        duration: "30 min",
        theory: `# CPU Scheduling Algorithms

## Scheduling Criteria
- **CPU Utilization** - Keep CPU busy
- **Throughput** - Processes completed per time unit
- **Turnaround Time** - Time from submission to completion
- **Waiting Time** - Time in ready queue
- **Response Time** - Time to first response

## 1. First Come First Served (FCFS)
Simple queue-based scheduling.
\`\`\`
Process | Burst Time
P1      | 24
P2      | 3
P3      | 3

Gantt Chart: |---P1---|P2|P3|
             0      24  27  30

Average Waiting Time = (0+24+27)/3 = 17
\`\`\`

## 2. Shortest Job First (SJF)
Minimum average waiting time.
\`\`\`
Process | Burst Time
P1      | 6
P2      | 8
P3      | 7
P4      | 3

Order: P4 → P1 → P3 → P2
Avg Wait = (0+3+9+16)/4 = 7
\`\`\`

## 3. Round Robin (RR)
Time quantum based, preemptive.
\`\`\`
Time Quantum = 4

Process | Burst Time
P1      | 10
P2      | 4
P3      | 5

|P1|P2|P3|P1|P3|P1|
0  4  8 12 16 17 19
\`\`\`

## 4. Priority Scheduling
Process with highest priority runs first.

## Viewing Scheduler Info
\`\`\`bash
$ chrt -p $$           # Scheduling policy
$ cat /proc/sched_debug # Scheduler debug
$ cat /sys/block/sda/queue/scheduler
\`\`\``,
        commands: ["chrt -p $$", "ps -eo pid,ni,pri,cmd"],
        challenge: "View the scheduling priority of your current shell process.",
        hint: "chrt -p $$"
      },
      {
        id: "memory-management",
        title: "Memory Management",
        description: "Paging, segmentation, and memory allocation",
        duration: "35 min",
        theory: `# Memory Management

## Memory Hierarchy
\`\`\`
     ┌───────────┐
     │ Registers │ ← Fastest, smallest
     ├───────────┤
     │   Cache   │
     ├───────────┤
     │   RAM     │
     ├───────────┤
     │   SSD     │
     ├───────────┤
     │   HDD     │ ← Slowest, largest
     └───────────┘
\`\`\`

## Paging
Memory divided into fixed-size pages (typically 4KB).

\`\`\`
Virtual Address Space:        Physical Memory:
┌──────┐                      ┌──────┐
│Page 0│ ────────────────────▶│Frame2│
├──────┤                      ├──────┤
│Page 1│ ──────┐              │Frame0│
├──────┤       │              ├──────┤
│Page 2│ ──┐   └─────────────▶│Frame1│
├──────┤   │                  ├──────┤
│Page 3│   └─────────────────▶│Frame3│
└──────┘                      └──────┘
\`\`\`

## Page Table
Maps virtual pages to physical frames:
\`\`\`
Virtual Address: | Page Number | Offset |
                      │              │
                      ▼              │
               ┌─────────────┐       │
               │ Page Table  │       │
               │ Frame Num   │       │
               └──────┬──────┘       │
                      │              │
                      ▼              ▼
Physical Address: | Frame Number | Offset |
\`\`\`

## Memory Commands
\`\`\`bash
$ free -h                  # Memory usage
$ cat /proc/meminfo        # Detailed memory info
$ vmstat 1                 # Virtual memory stats
$ cat /proc/self/maps      # Process memory map
$ getconf PAGE_SIZE        # Page size
\`\`\`

## Viewing Page Tables
\`\`\`bash
$ cat /proc/self/pagemap   # Page mappings
$ cat /proc/buddyinfo      # Free memory fragments
\`\`\``,
        commands: ["free -h", "cat /proc/meminfo", "vmstat 1"],
        challenge: "Check system memory using free -h and understand the output.",
        hint: "free -h shows total, used, free, and available memory"
      },
      {
        id: "virtual-memory",
        title: "Virtual Memory",
        description: "Page replacement algorithms and thrashing",
        duration: "30 min",
        theory: `# Virtual Memory

## Concept
Virtual memory allows execution of processes not completely in memory.

Benefits:
- Programs larger than physical memory
- More processes in memory
- Memory isolation between processes

## Demand Paging
Load pages only when needed (page fault).

## Page Replacement Algorithms

### 1. FIFO (First In First Out)
Replace the oldest page.
\`\`\`
Reference: 7 0 1 2 0 3 0 4
Frames: 3

7 → |7|-|-|
0 → |7|0|-|
1 → |7|0|1|
2 → |2|0|1| Page fault! Replace 7
0 → |2|0|1| Hit!
3 → |2|3|1| Page fault! Replace 0
...
\`\`\`

### 2. LRU (Least Recently Used)
Replace the least recently used page.

### 3. Optimal
Replace page not used for longest time (theoretical).

## Thrashing
When a system spends more time paging than executing.

Causes:
- Too many processes
- Working set > Physical memory

## Monitor Virtual Memory
\`\`\`bash
$ vmstat 1 5              # VM stats every 1s
$ cat /proc/sys/vm/swappiness
$ swapon --show           # Swap usage
$ cat /proc/vmstat        # Detailed VM stats
\`\`\`

## Key Metrics
- **si** - Swap in (from disk)
- **so** - Swap out (to disk)
- **bi** - Blocks in
- **bo** - Blocks out`,
        commands: ["vmstat 1 5", "swapon --show", "cat /proc/vmstat | head -20"],
        challenge: "Monitor virtual memory activity for 5 seconds.",
        hint: "vmstat 1 5"
      },
      {
        id: "file-system-internals",
        title: "File System Internals",
        description: "Inodes, superblocks, and file system structures",
        duration: "30 min",
        theory: `# File System Internals

## File System Structure
\`\`\`
┌───────────────────────────────────────────┐
│             Boot Block                    │
├───────────────────────────────────────────┤
│             Superblock                    │
│  - FS size, block size, free blocks       │
├───────────────────────────────────────────┤
│          Inode Table                      │
│  - One inode per file                     │
├───────────────────────────────────────────┤
│             Data Blocks                   │
│  - Actual file contents                   │
└───────────────────────────────────────────┘
\`\`\`

## Inode Structure
\`\`\`
Inode:
├── File Type & Permissions
├── Owner (UID/GID)
├── Size
├── Timestamps (atime, mtime, ctime)
├── Link Count
├── Direct Block Pointers (12)
├── Indirect Block Pointer
├── Double Indirect Pointer
└── Triple Indirect Pointer
\`\`\`

## Block Addressing
\`\`\`
4KB blocks, 32-bit pointers:
Direct: 12 × 4KB = 48KB
Single Indirect: 1024 × 4KB = 4MB
Double Indirect: 1024² × 4KB = 4GB
Triple Indirect: 1024³ × 4KB = 4TB
\`\`\`

## File System Commands
\`\`\`bash
$ df -Ti                   # FS types and inodes
$ stat file.txt            # Inode info
$ ls -i                    # Show inodes
$ tune2fs -l /dev/sda1     # Superblock info
$ dumpe2fs /dev/sda1       # Detailed FS info
\`\`\`

## Directory Entry
\`\`\`
Directory = List of (filename, inode) pairs

$ ls -ali
12345 drwxr-xr-x  2 user group 4096 Jan 20 .
12340 drwxr-xr-x 10 user group 4096 Jan 20 ..
12346 -rw-r--r--  1 user group  100 Jan 20 file.txt
\`\`\``,
        commands: ["df -Ti", "stat", "ls -i"],
        challenge: "View inode information for a file using stat command.",
        hint: "touch test.txt && stat test.txt"
      },
      {
        id: "io-systems",
        title: "I/O Systems",
        description: "Device drivers, interrupts, and DMA",
        duration: "25 min",
        theory: `# I/O Systems

## I/O Architecture
\`\`\`
CPU ←──────→ Memory
 │
 ├──→ PCIe/USB Controllers
 │         │
 │         ├── Graphics Card
 │         ├── Network Card
 │         └── Storage (NVMe)
 │
 └──→ Chipset
           │
           ├── SATA Controllers
           ├── USB Controllers
           └── Audio
\`\`\`

## I/O Methods

### 1. Programmed I/O (Polling)
CPU continuously checks device status.

### 2. Interrupt-Driven I/O
Device signals CPU when ready.

### 3. DMA (Direct Memory Access)
Device transfers data directly to memory.

\`\`\`
Without DMA:          With DMA:
CPU→Device→CPU→Mem    CPU initiates→DMA→Mem
(CPU involved)        (CPU free)
\`\`\`

## View I/O Information
\`\`\`bash
$ lsblk                    # Block devices
$ lspci                    # PCI devices
$ lsusb                    # USB devices
$ cat /proc/interrupts     # Interrupt counts
$ cat /proc/ioports        # I/O port addresses
$ iostat -x 1              # I/O statistics
\`\`\`

## Device Files
\`\`\`bash
$ ls -l /dev/sda           # Block device
$ ls -l /dev/tty           # Character device
$ ls -l /dev/null          # Null device
\`\`\``,
        commands: ["lsblk", "cat /proc/interrupts", "iostat 1 3"],
        challenge: "List all block devices on the system.",
        hint: "lsblk"
      },
      {
        id: "deadlocks",
        title: "Deadlocks",
        description: "Detection, prevention, and recovery",
        duration: "25 min",
        theory: `# Deadlocks

## What is a Deadlock?
A set of processes waiting for resources held by each other.

## Deadlock Conditions
All four must hold simultaneously:

1. **Mutual Exclusion** - Resource held exclusively
2. **Hold and Wait** - Holding while waiting for more
3. **No Preemption** - Cannot force release
4. **Circular Wait** - Circular chain of waiting

## Resource Allocation Graph
\`\`\`
Process ──▶ Resource (Request)
Resource ──▶ Process (Assignment)

Deadlock:
    ┌────────────────────┐
    │                    ▼
   P1 ──────▶ R1 ──────▶ P2
    ▲                    │
    └────── R2 ◀─────────┘
\`\`\`

## Deadlock Prevention
Break one of the four conditions:

1. **No Mutual Exclusion** - Use sharable resources
2. **No Hold and Wait** - Request all at once
3. **Preemption** - Allow forced release
4. **No Circular Wait** - Order resources

## Deadlock Detection
Periodically check for cycles in wait-for graph.

## Deadlock Recovery
1. **Process Termination** - Kill deadlocked processes
2. **Resource Preemption** - Take resources from processes

## Detecting Deadlocks in Linux
\`\`\`bash
$ cat /proc/locks          # File locks
$ lslocks                  # List all locks
$ ps aux | grep 'D'        # Processes in D state
\`\`\``,
        commands: ["cat /proc/locks", "lslocks"],
        challenge: "View current file locks on the system.",
        hint: "lslocks or cat /proc/locks"
      },
      {
        id: "threads-concurrency",
        title: "Threads and Concurrency",
        description: "User vs kernel threads, thread pools",
        duration: "30 min",
        theory: `# Threads and Concurrency

## Threads vs Processes
\`\`\`
Process:                    Thread:
┌─────────────────────┐     ┌─────────────────────┐
│ Code + Data + Heap  │     │ Shared: Code, Data, │
│ Stack               │     │         Heap, Files │
│ Registers           │     │ Private: Stack,     │
│ Files               │     │          Registers  │
└─────────────────────┘     └─────────────────────┘
\`\`\`

## Thread Types

### User-Level Threads
- Managed by thread library
- Kernel unaware
- Fast switching
- Example: Green threads

### Kernel-Level Threads
- Managed by OS
- Kernel aware
- Can utilize multiple CPUs
- Example: Linux pthreads

## Threading Models
\`\`\`
Many-to-One:    Many-to-Many:    One-to-One:
   User            User             User
  /  |  \\         /  |  \\         /  |  \\
 T1 T2 T3        T1 T2 T3        T1 T2 T3
    |            /  |  \\          |  |  |
  Kernel     K1   K2             K1 K2 K3
\`\`\`

## View Threads
\`\`\`bash
$ ps -eLf                  # All threads
$ ps -T -p <pid>           # Threads of process
$ cat /proc/<pid>/status   # Thread count (Threads:)
$ top -H                   # Thread view
$ htop                     # Thread tree view
\`\`\`

## Thread Creation (C)
\`\`\`c
#include <pthread.h>

void* thread_func(void* arg) {
    printf("Thread running\\n");
    return NULL;
}

int main() {
    pthread_t thread;
    pthread_create(&thread, NULL, thread_func, NULL);
    pthread_join(thread, NULL);
    return 0;
}
\`\`\``,
        commands: ["ps -eLf", "top -H"],
        challenge: "View all threads of a running process.",
        hint: "ps -eLf | head -20"
      },
      {
        id: "synchronization",
        title: "Synchronization",
        description: "Mutexes, semaphores, and race conditions",
        duration: "30 min",
        theory: `# Synchronization

## Race Condition
When outcome depends on timing of events.

\`\`\`
Thread 1:        Thread 2:
read(x)          read(x)
x = x + 1        x = x + 1
write(x)         write(x)

Result: x increased by 1 instead of 2!
\`\`\`

## Critical Section
Code that accesses shared resources.

\`\`\`
entry section
   CRITICAL SECTION
exit section
   remainder section
\`\`\`

## Mutex (Mutual Exclusion)
Binary lock - only one thread can hold.

\`\`\`c
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

pthread_mutex_lock(&lock);
// Critical section
pthread_mutex_unlock(&lock);
\`\`\`

## Semaphore
Counting synchronization primitive.

\`\`\`c
sem_t sem;
sem_init(&sem, 0, 1);  // Initialize to 1

sem_wait(&sem);   // Decrement (P operation)
// Critical section
sem_post(&sem);   // Increment (V operation)
\`\`\`

## Condition Variables
Wait for a condition to be true.

## Deadlock with Locks
\`\`\`
Thread 1:        Thread 2:
lock(A)          lock(B)
lock(B)  ←       lock(A)  ← Deadlock!
\`\`\`

## Prevention: Lock Ordering
Always acquire locks in the same order.

## Monitor Synchronization
\`\`\`bash
$ ipcs                     # IPC facilities
$ ipcs -s                  # Semaphores
$ ipcs -m                  # Shared memory
$ cat /proc/locks          # File locks
\`\`\``,
        commands: ["ipcs", "ipcs -s"],
        challenge: "View IPC semaphores and shared memory segments.",
        hint: "ipcs"
      }
    ]
  }
];

// Helper Functions
export const getCourseById = (courseId) => courses.find(c => c.id === courseId);

export const getLessonById = (courseId, lessonId) => {
  const course = getCourseById(courseId);
  return course?.lessons.find(l => l.id === lessonId);
};

export const getNextLesson = (courseId, currentLessonId) => {
  const course = getCourseById(courseId);
  if (!course) return null;
  const idx = course.lessons.findIndex(l => l.id === currentLessonId);
  return idx >= 0 && idx < course.lessons.length - 1 ? course.lessons[idx + 1] : null;
};

export const getPrevLesson = (courseId, currentLessonId) => {
  const course = getCourseById(courseId);
  if (!course) return null;
  const idx = course.lessons.findIndex(l => l.id === currentLessonId);
  return idx > 0 ? course.lessons[idx - 1] : null;
};

export const getTotalLessons = () => courses.reduce((sum, c) => sum + c.lessons.length, 0);
export const getTotalDuration = () => courses.reduce((sum, c) => sum + parseInt(c.duration), 0);
