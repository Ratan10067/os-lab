"""
Admin Portal - Protected routes for system administration
"""

import os
import shutil
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Header, Query, status
from pydantic import BaseModel
import logging

from .config import get_settings
from .database import get_database
from .auth import USERS_BASE_PATH

logger = logging.getLogger(__name__)
settings = get_settings()

router = APIRouter(prefix="/admin/portal", tags=["Admin"])


# ===== Models =====

class FolderInfo(BaseModel):
    username: str
    folder_path: str
    size_bytes: int
    size_human: str
    file_count: int
    exists: bool


class UserInfo(BaseModel):
    id: str
    username: str
    email: str
    folder_path: str
    created_at: datetime
    last_active: Optional[datetime] = None
    folder_exists: bool
    folder_size: Optional[str] = None


class AdminStats(BaseModel):
    total_users: int
    total_folders: int
    total_disk_usage: str
    active_sessions: int
    users_base_path: str


class SystemInfo(BaseModel):
    environment: str
    python_version: str
    users_base_path: str
    proot_available: bool
    rootfs_exists: bool
    disk_free: str
    disk_total: str


# ===== Helper Functions =====

def get_folder_size(path: str) -> int:
    """Get total size of a folder in bytes"""
    total = 0
    try:
        for dirpath, dirnames, filenames in os.walk(path):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                try:
                    total += os.path.getsize(fp)
                except (OSError, FileNotFoundError):
                    pass
    except (OSError, FileNotFoundError):
        pass
    return total


def format_size(size_bytes: int) -> str:
    """Format bytes to human readable string"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} TB"


def count_files(path: str) -> int:
    """Count total files in a folder"""
    count = 0
    try:
        for _, _, filenames in os.walk(path):
            count += len(filenames)
    except (OSError, FileNotFoundError):
        pass
    return count


def verify_admin(x_admin_secret: str = Header(None)):
    """Verify admin secret from header"""
    if not x_admin_secret or x_admin_secret != settings.admin_secret:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin secret"
        )
    return True


# ===== Endpoints =====

@router.get("/verify")
async def verify_access(x_admin_secret: str = Header(None)):
    """Verify admin access with secret key"""
    if not x_admin_secret or x_admin_secret != settings.admin_secret:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin secret"
        )
    return {"status": "authorized", "message": "Admin access verified"}


@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(x_admin_secret: str = Header(None)):
    """Get overall admin statistics"""
    verify_admin(x_admin_secret)
    
    try:
        db = get_database()
        total_users = await db.users.count_documents({})
    except:
        total_users = 0
    
    # Count folders
    total_folders = 0
    total_size = 0
    try:
        if os.path.exists(USERS_BASE_PATH):
            for entry in os.listdir(USERS_BASE_PATH):
                folder_path = os.path.join(USERS_BASE_PATH, entry)
                if os.path.isdir(folder_path):
                    total_folders += 1
                    total_size += get_folder_size(folder_path)
    except Exception as e:
        logger.error(f"Error counting folders: {e}")
    
    # Get active sessions (import here to avoid circular imports)
    active_sessions = 0
    try:
        from .sessions import SessionManager
        # This is a rough estimate - in production you'd track this properly
        active_sessions = 0
    except:
        pass
    
    return AdminStats(
        total_users=total_users,
        total_folders=total_folders,
        total_disk_usage=format_size(total_size),
        active_sessions=active_sessions,
        users_base_path=USERS_BASE_PATH
    )


@router.get("/users", response_model=List[UserInfo])
async def list_all_users(
    x_admin_secret: str = Header(None),
    limit: int = Query(50, ge=1, le=500),
    skip: int = Query(0, ge=0)
):
    """List all registered users with their folder info"""
    verify_admin(x_admin_secret)
    
    try:
        db = get_database()
        cursor = db.users.find().sort("created_at", -1).skip(skip).limit(limit)
        users = await cursor.to_list(length=limit)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database error: {e}")
    
    result = []
    for user in users:
        folder_path = user.get("folder_path", "")
        folder_exists = os.path.exists(folder_path) if folder_path else False
        folder_size = None
        
        if folder_exists:
            size = get_folder_size(folder_path)
            folder_size = format_size(size)
        
        result.append(UserInfo(
            id=str(user["_id"]),
            username=user["username"],
            email=user.get("email", ""),
            folder_path=folder_path,
            created_at=user["created_at"],
            last_active=user.get("last_active"),
            folder_exists=folder_exists,
            folder_size=folder_size
        ))
    
    return result


@router.get("/folders", response_model=List[FolderInfo])
async def list_all_folders(x_admin_secret: str = Header(None)):
    """List all user folders on disk"""
    verify_admin(x_admin_secret)
    
    folders = []
    try:
        if os.path.exists(USERS_BASE_PATH):
            for entry in os.listdir(USERS_BASE_PATH):
                folder_path = os.path.join(USERS_BASE_PATH, entry)
                if os.path.isdir(folder_path):
                    size = get_folder_size(folder_path)
                    folders.append(FolderInfo(
                        username=entry,
                        folder_path=folder_path,
                        size_bytes=size,
                        size_human=format_size(size),
                        file_count=count_files(folder_path),
                        exists=True
                    ))
    except Exception as e:
        logger.error(f"Error listing folders: {e}")
        raise HTTPException(status_code=500, detail=f"Error listing folders: {e}")
    
    # Sort by size descending
    folders.sort(key=lambda x: x.size_bytes, reverse=True)
    return folders


@router.get("/user/{username}")
async def get_user_details(username: str, x_admin_secret: str = Header(None)):
    """Get detailed info about a specific user"""
    verify_admin(x_admin_secret)
    
    try:
        db = get_database()
        user = await db.users.find_one({"username": username})
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database error: {e}")
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    folder_path = user.get("folder_path", "")
    folder_exists = os.path.exists(folder_path) if folder_path else False
    
    # Get folder contents
    folder_contents = []
    if folder_exists:
        try:
            for entry in os.listdir(folder_path):
                entry_path = os.path.join(folder_path, entry)
                is_dir = os.path.isdir(entry_path)
                size = 0 if is_dir else os.path.getsize(entry_path)
                folder_contents.append({
                    "name": entry,
                    "type": "directory" if is_dir else "file",
                    "size": format_size(size) if not is_dir else None
                })
        except Exception as e:
            logger.error(f"Error reading folder: {e}")
    
    # Get progress
    progress = None
    try:
        progress = await db.progress.find_one({"user_id": str(user["_id"])})
    except:
        pass
    
    return {
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user.get("email"),
            "created_at": user["created_at"],
            "last_active": user.get("last_active"),
            "folder_path": folder_path
        },
        "folder": {
            "exists": folder_exists,
            "size": format_size(get_folder_size(folder_path)) if folder_exists else None,
            "file_count": count_files(folder_path) if folder_exists else 0,
            "contents": folder_contents
        },
        "progress": {
            "completed_lessons": progress.get("completed_lessons", []) if progress else [],
            "last_updated": progress.get("last_updated") if progress else None
        }
    }


@router.delete("/user/{username}/folder")
async def delete_user_folder(username: str, x_admin_secret: str = Header(None)):
    """Delete a user's folder (keeps the account)"""
    verify_admin(x_admin_secret)
    
    folder_path = os.path.join(USERS_BASE_PATH, username)
    
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail="Folder not found")
    
    try:
        shutil.rmtree(folder_path)
        logger.info(f"Admin deleted folder for user: {username}")
        return {"status": "success", "message": f"Folder deleted for {username}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting folder: {e}")


@router.delete("/user/{username}")
async def delete_user_account(username: str, x_admin_secret: str = Header(None)):
    """Delete a user's account and folder completely"""
    verify_admin(x_admin_secret)
    
    try:
        db = get_database()
        user = await db.users.find_one({"username": username})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Delete from database
        await db.users.delete_one({"username": username})
        await db.progress.delete_one({"user_id": str(user["_id"])})
        
        # Delete folder
        folder_path = user.get("folder_path", "")
        if folder_path and os.path.exists(folder_path):
            shutil.rmtree(folder_path)
        
        logger.info(f"Admin deleted user account: {username}")
        return {"status": "success", "message": f"User {username} deleted completely"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {e}")


@router.get("/system", response_model=SystemInfo)
async def get_system_info(x_admin_secret: str = Header(None)):
    """Get system/environment information"""
    verify_admin(x_admin_secret)
    
    import sys
    
    # Check proot
    proot_available = os.path.exists('/usr/bin/proot')
    rootfs_exists = os.path.isdir('/app/rootfs')
    
    # Disk info
    try:
        stat = os.statvfs(USERS_BASE_PATH if os.path.exists(USERS_BASE_PATH) else '/')
        disk_free = format_size(stat.f_bfree * stat.f_bsize)
        disk_total = format_size(stat.f_blocks * stat.f_bsize)
    except:
        disk_free = "Unknown"
        disk_total = "Unknown"
    
    return SystemInfo(
        environment="Docker/Production" if proot_available else "Local Development",
        python_version=sys.version.split()[0],
        users_base_path=USERS_BASE_PATH,
        proot_available=proot_available,
        rootfs_exists=rootfs_exists,
        disk_free=disk_free,
        disk_total=disk_total
    )


@router.post("/cleanup/orphan-folders")
async def cleanup_orphan_folders(x_admin_secret: str = Header(None), dry_run: bool = True):
    """Find and optionally delete folders without matching users"""
    verify_admin(x_admin_secret)
    
    try:
        db = get_database()
        users = await db.users.find().to_list(length=10000)
        registered_usernames = {u["username"] for u in users}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database error: {e}")
    
    orphan_folders = []
    total_size = 0
    
    try:
        if os.path.exists(USERS_BASE_PATH):
            for entry in os.listdir(USERS_BASE_PATH):
                folder_path = os.path.join(USERS_BASE_PATH, entry)
                if os.path.isdir(folder_path) and entry not in registered_usernames:
                    size = get_folder_size(folder_path)
                    orphan_folders.append({
                        "username": entry,
                        "folder_path": folder_path,
                        "size": format_size(size)
                    })
                    total_size += size
                    
                    if not dry_run:
                        shutil.rmtree(folder_path)
                        logger.info(f"Deleted orphan folder: {entry}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing folders: {e}")
    
    return {
        "orphan_count": len(orphan_folders),
        "total_size": format_size(total_size),
        "dry_run": dry_run,
        "deleted": not dry_run,
        "folders": orphan_folders
    }


@router.get("/user/{username}/files")
async def browse_user_files(
    username: str, 
    path: str = Query("", description="Relative path within user's folder"),
    x_admin_secret: str = Header(None)
):
    """Browse files and folders within a user's directory"""
    verify_admin(x_admin_secret)
    
    folder_path = os.path.join(USERS_BASE_PATH, username)
    
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail="User folder not found")
    
    # Build target path safely
    if path:
        # Prevent path traversal attacks
        safe_path = os.path.normpath(path).lstrip(os.sep)
        if safe_path.startswith('..'):
            raise HTTPException(status_code=400, detail="Invalid path")
        target_path = os.path.join(folder_path, safe_path)
    else:
        target_path = folder_path
    
    # Ensure target is within user's folder
    if not os.path.abspath(target_path).startswith(os.path.abspath(folder_path)):
        raise HTTPException(status_code=400, detail="Path outside user folder")
    
    if not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail="Path not found")
    
    if not os.path.isdir(target_path):
        raise HTTPException(status_code=400, detail="Path is not a directory")
    
    # List contents
    items = []
    try:
        for entry in sorted(os.listdir(target_path)):
            entry_path = os.path.join(target_path, entry)
            is_dir = os.path.isdir(entry_path)
            
            try:
                stat = os.stat(entry_path)
                if is_dir:
                    size = get_folder_size(entry_path)
                else:
                    size = stat.st_size
                modified = datetime.fromtimestamp(stat.st_mtime)
            except:
                size = 0
                modified = None
            
            items.append({
                "name": entry,
                "type": "directory" if is_dir else "file",
                "size_bytes": size,
                "size_human": format_size(size),
                "modified": modified.isoformat() if modified else None,
                "path": os.path.join(path, entry) if path else entry
            })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading directory: {e}")
    
    # Sort: directories first, then files, alphabetically
    items.sort(key=lambda x: (0 if x["type"] == "directory" else 1, x["name"].lower()))
    
    return {
        "username": username,
        "current_path": path or "/",
        "parent_path": os.path.dirname(path) if path else None,
        "items": items,
        "total_items": len(items),
        "total_size": format_size(sum(i["size_bytes"] for i in items))
    }


@router.delete("/user/{username}/files")
async def delete_user_file(
    username: str, 
    path: str = Query(..., description="Relative path to file/folder to delete"),
    x_admin_secret: str = Header(None)
):
    """Delete a specific file or folder within a user's directory"""
    verify_admin(x_admin_secret)
    
    if not path:
        raise HTTPException(status_code=400, detail="Path is required")
    
    folder_path = os.path.join(USERS_BASE_PATH, username)
    
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail="User folder not found")
    
    # Build target path safely
    safe_path = os.path.normpath(path).lstrip(os.sep)
    if safe_path.startswith('..') or safe_path == '.':
        raise HTTPException(status_code=400, detail="Invalid path")
    
    target_path = os.path.join(folder_path, safe_path)
    
    # Ensure target is within user's folder (not the folder itself)
    abs_target = os.path.abspath(target_path)
    abs_folder = os.path.abspath(folder_path)
    if abs_target == abs_folder or not abs_target.startswith(abs_folder):
        raise HTTPException(status_code=400, detail="Cannot delete user root folder or path outside user folder")
    
    if not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail="File or folder not found")
    
    try:
        is_dir = os.path.isdir(target_path)
        size = get_folder_size(target_path) if is_dir else os.path.getsize(target_path)
        
        if is_dir:
            shutil.rmtree(target_path)
        else:
            os.remove(target_path)
        
        logger.info(f"Admin deleted {'folder' if is_dir else 'file'}: {target_path}")
        
        return {
            "status": "success",
            "message": f"{'Folder' if is_dir else 'File'} deleted successfully",
            "deleted_path": path,
            "freed_space": format_size(size)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting: {e}")


@router.get("/user/{username}/files/search")
async def search_user_files(
    username: str,
    query: str = Query(..., min_length=1, description="Search query (filename)"),
    min_size: int = Query(0, ge=0, description="Minimum file size in bytes"),
    x_admin_secret: str = Header(None)
):
    """Search for files in user's folder, optionally filter by size"""
    verify_admin(x_admin_secret)
    
    folder_path = os.path.join(USERS_BASE_PATH, username)
    
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail="User folder not found")
    
    results = []
    try:
        for root, dirs, files in os.walk(folder_path):
            for name in files + dirs:
                if query.lower() in name.lower():
                    full_path = os.path.join(root, name)
                    rel_path = os.path.relpath(full_path, folder_path)
                    is_dir = os.path.isdir(full_path)
                    
                    try:
                        if is_dir:
                            size = get_folder_size(full_path)
                        else:
                            size = os.path.getsize(full_path)
                    except:
                        size = 0
                    
                    if size >= min_size:
                        results.append({
                            "name": name,
                            "path": rel_path,
                            "type": "directory" if is_dir else "file",
                            "size_bytes": size,
                            "size_human": format_size(size)
                        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching: {e}")
    
    # Sort by size descending
    results.sort(key=lambda x: x["size_bytes"], reverse=True)
    
    return {
        "username": username,
        "query": query,
        "min_size": min_size,
        "results": results[:100],  # Limit to 100 results
        "total_found": len(results)
    }


@router.get("/large-files")
async def find_large_files(
    min_size_mb: float = Query(1.0, ge=0.1, description="Minimum size in MB"),
    x_admin_secret: str = Header(None)
):
    """Find large files across all users"""
    verify_admin(x_admin_secret)
    
    min_size_bytes = int(min_size_mb * 1024 * 1024)
    results = []
    
    try:
        if os.path.exists(USERS_BASE_PATH):
            for username in os.listdir(USERS_BASE_PATH):
                user_folder = os.path.join(USERS_BASE_PATH, username)
                if os.path.isdir(user_folder):
                    for root, dirs, files in os.walk(user_folder):
                        for name in files:
                            full_path = os.path.join(root, name)
                            try:
                                size = os.path.getsize(full_path)
                                if size >= min_size_bytes:
                                    rel_path = os.path.relpath(full_path, user_folder)
                                    results.append({
                                        "username": username,
                                        "filename": name,
                                        "path": rel_path,
                                        "size_bytes": size,
                                        "size_human": format_size(size)
                                    })
                            except:
                                pass
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scanning: {e}")
    
    # Sort by size descending
    results.sort(key=lambda x: x["size_bytes"], reverse=True)
    
    return {
        "min_size_mb": min_size_mb,
        "total_found": len(results),
        "total_size": format_size(sum(r["size_bytes"] for r in results)),
        "files": results[:50]  # Limit to 50 results
    }


@router.get("/user/{username}/files/view")
async def view_file_content(
    username: str,
    path: str = Query(..., description="Relative path to file to view"),
    x_admin_secret: str = Header(None)
):
    """View the contents of a file (text files only, max 1MB)"""
    verify_admin(x_admin_secret)
    
    folder_path = os.path.join(USERS_BASE_PATH, username)
    
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail="User folder not found")
    
    # Build target path safely
    safe_path = os.path.normpath(path).lstrip(os.sep)
    if safe_path.startswith('..'):
        raise HTTPException(status_code=400, detail="Invalid path")
    
    target_path = os.path.join(folder_path, safe_path)
    
    # Ensure target is within user's folder
    if not os.path.abspath(target_path).startswith(os.path.abspath(folder_path)):
        raise HTTPException(status_code=400, detail="Path outside user folder")
    
    if not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    if os.path.isdir(target_path):
        raise HTTPException(status_code=400, detail="Cannot view directory contents")
    
    # Check file size (max 1MB for viewing)
    file_size = os.path.getsize(target_path)
    max_size = 1024 * 1024  # 1MB
    
    if file_size > max_size:
        return {
            "filename": os.path.basename(path),
            "path": path,
            "size": format_size(file_size),
            "viewable": False,
            "reason": f"File too large ({format_size(file_size)}). Max viewable size is 1MB.",
            "content": None
        }
    
    # Try to read as text
    try:
        # Try common encodings
        content = None
        encoding_used = None
        
        for encoding in ['utf-8', 'latin-1', 'cp1252']:
            try:
                with open(target_path, 'r', encoding=encoding) as f:
                    content = f.read()
                    encoding_used = encoding
                    break
            except UnicodeDecodeError:
                continue
        
        if content is None:
            # Binary file
            return {
                "filename": os.path.basename(path),
                "path": path,
                "size": format_size(file_size),
                "viewable": False,
                "reason": "Binary file cannot be displayed as text",
                "content": None
            }
        
        # Detect file type for syntax highlighting hint
        ext = os.path.splitext(path)[1].lower()
        language_map = {
            '.py': 'python',
            '.js': 'javascript',
            '.jsx': 'jsx',
            '.ts': 'typescript',
            '.tsx': 'tsx',
            '.html': 'html',
            '.css': 'css',
            '.json': 'json',
            '.md': 'markdown',
            '.sh': 'bash',
            '.bash': 'bash',
            '.c': 'c',
            '.cpp': 'cpp',
            '.h': 'c',
            '.java': 'java',
            '.rb': 'ruby',
            '.go': 'go',
            '.rs': 'rust',
            '.sql': 'sql',
            '.yml': 'yaml',
            '.yaml': 'yaml',
            '.xml': 'xml',
            '.txt': 'text',
            '.log': 'text',
            '.conf': 'text',
            '.cfg': 'text',
        }
        
        return {
            "filename": os.path.basename(path),
            "path": path,
            "size": format_size(file_size),
            "viewable": True,
            "encoding": encoding_used,
            "language": language_map.get(ext, 'text'),
            "lines": content.count('\n') + 1,
            "content": content
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {e}")
