<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'key',
        'user_id',
        'description'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function issues()
    {
        return $this->hasMany(Issue::class);
    }

    public function issueTypes()
    {
        return $this->hasMany(IssueType::class);
    }

    public function issueCategories()
    {
        return $this->hasMany(IssueCategory::class);
    }

    public function members()
    {
        return $this->hasMany(Member::class);
    }

    public function getAllMembers()
    {
        $members = $this->members()
            ->select('users.id as value', 'users.name as label')
            ->join('users', 'users.id', '=', 'members.user_id')
            ->get();
        $owner = User::select('id as value', 'name as label')
            ->where('id', $this->user_id)
            ->first();
        $members->push($owner);
        return $members;
    }

    public function hasPermissionCreateIssue($userId)
    {
        if ($this->user_id === $userId) return true;
        $member = $this->members()
            ->where('user_id', $userId)
            ->first();
        if ($member) return true;
        return false;
    }
}
