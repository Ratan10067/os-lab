"""
Process Management Lab Experiments
Example scripts and demos for learning process concepts
"""

FORK_DEMO = '''#!/bin/bash
# Fork Demo - Creates child processes
echo "=== Fork Demo ==="
echo "Parent PID: $$"

# Simulate fork with background process
(
    echo "Child process PID: $$"
    sleep 2
    echo "Child exiting"
) &

echo "Child started with PID: $!"
wait
echo "Parent done"
'''

PROCESS_TREE = '''#!/bin/bash
# Show process tree
echo "=== Process Tree ==="
if command -v pstree &> /dev/null; then
    pstree -p $$
else
    ps -ef --forest 2>/dev/null || ps -ef
fi
'''

SIGNALS_DEMO = '''#!/bin/bash
# Signal handling demo
echo "=== Signal Demo ==="
echo "This process PID: $$"

# Set up signal handler
trap 'echo "Caught SIGINT (Ctrl+C)!"' INT
trap 'echo "Caught SIGTERM"' TERM

echo "Press Ctrl+C to test signal handling (or wait 10s)"
sleep 10
echo "Done"
'''

ZOMBIE_DEMO = '''#!/bin/bash
# Zombie process demo (educational)
echo "=== Zombie Demo ==="
echo "Creating a 'zombie' process..."

# This creates a child that exits before parent waits
( exit 0 ) &
CHILD_PID=$!

echo "Child PID: $CHILD_PID"
echo "Check with: ps aux | grep defunct"
sleep 2
ps aux | grep -E 'defunct|Z' | grep -v grep || echo "No zombies (already reaped)"

# Clean up
wait 2>/dev/null
echo "Zombie cleaned up"
'''

EXPERIMENTS = {
    'fork': {
        'name': 'Fork Demo',
        'description': 'Demonstrates process creation with fork',
        'script': FORK_DEMO
    },
    'tree': {
        'name': 'Process Tree',
        'description': 'View the process hierarchy',
        'script': PROCESS_TREE
    },
    'signals': {
        'name': 'Signal Handling',
        'description': 'Learn about Unix signals',
        'script': SIGNALS_DEMO
    },
    'zombie': {
        'name': 'Zombie Process',
        'description': 'Understanding zombie processes',
        'script': ZOMBIE_DEMO
    }
}
