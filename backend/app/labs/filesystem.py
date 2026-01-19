"""
File System Lab Experiments
Example scripts for learning filesystem concepts
"""

PERMISSIONS_DEMO = '''#!/bin/bash
# File Permissions Demo
echo "=== File Permissions Demo ==="

# Create test file
echo "Hello World" > /tmp/testfile.txt
echo "Created: /tmp/testfile.txt"

# Show permissions
ls -la /tmp/testfile.txt

echo ""
echo "Changing permissions to 755..."
chmod 755 /tmp/testfile.txt
ls -la /tmp/testfile.txt

echo ""
echo "Changing to read-only (444)..."
chmod 444 /tmp/testfile.txt
ls -la /tmp/testfile.txt

# Cleanup
rm -f /tmp/testfile.txt
echo "Cleaned up"
'''

INODE_DEMO = '''#!/bin/bash
# Inode Demo
echo "=== Inode Demo ==="

# Create test file
echo "Test content" > /tmp/inode_test.txt

echo "File info with inode:"
ls -li /tmp/inode_test.txt

echo ""
echo "Detailed inode info:"
stat /tmp/inode_test.txt 2>/dev/null || ls -la /tmp/inode_test.txt

# Create hard link
ln /tmp/inode_test.txt /tmp/inode_link.txt 2>/dev/null

echo ""
echo "After creating hard link:"
ls -li /tmp/inode_test.txt /tmp/inode_link.txt 2>/dev/null

# Cleanup
rm -f /tmp/inode_test.txt /tmp/inode_link.txt
'''

DISK_USAGE_DEMO = '''#!/bin/bash
# Disk Usage Demo
echo "=== Disk Usage Demo ==="

echo "Disk space overview:"
df -h

echo ""
echo "Directory sizes in current location:"
du -sh * 2>/dev/null | head -10

echo ""
echo "Filesystem type info:"
df -T 2>/dev/null || mount | head -5
'''

EXPERIMENTS = {
    'permissions': {
        'name': 'File Permissions',
        'description': 'Understanding chmod and file permissions',
        'script': PERMISSIONS_DEMO
    },
    'inodes': {
        'name': 'Inodes & Links',
        'description': 'Learn about inodes and hard links',
        'script': INODE_DEMO
    },
    'disk': {
        'name': 'Disk Usage',
        'description': 'Check disk space and usage',
        'script': DISK_USAGE_DEMO
    }
}
