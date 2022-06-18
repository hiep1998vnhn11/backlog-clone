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
}
