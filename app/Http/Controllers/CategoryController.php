<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Requests\Project\CreateCategoryRequest;
use App\Http\Requests\Project\UpdateCategoryRequest as ProjectUpdateCategoryRequest;
use App\Models\IssueCategory;
use App\Models\Project;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if (!$request->project_key) return $this->sendRespondError();
        $project = Project::where('key', $request->project_key)->firstOrFail();
        if (!$project->hasPermissionCreateIssue(auth()->id())) return $this->sendForbidden();
        $categories = $project->issueCategories;

        return $this->sendRespondSuccess($categories);
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCategoryRequest $request)
    {
        $project = Project::where('key', $request->project_key)->firstOrFail();
        if (!$project->hasPermissionCreateIssue(auth()->id())) return $this->sendForbidden();
        $checkCategory = IssueCategory::where('project_id', $project->id)
            ->where('name', $request->name)->first();
        if ($checkCategory) return $this->sendUnvalidated([
            'name' => ['Category name already exists in this project! Please add other name.']
        ]);
        IssueCategory::create(
            array_merge($request->validated(), [
                'project_id' => $project->id,
            ])
        );
        return $this->sendRespondSuccess();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ProjectUpdateCategoryRequest $request, IssueCategory $category)
    {
        if (!$category->project->hasPermissionCreateIssue(auth()->id())) return $this->sendForbidden();
        $checkCategory = $category->project->issueCategories()
            ->where('name', $request->name)
            ->where('id', '!=', $category->id)
            ->first();
        if ($checkCategory) return $this->sendUnvalidated([
            'name' => ['Category name already exists in this project! Please add other name.']
        ]);
        $category->update(
            $request->validated()
        );
        return $this->sendRespondSuccess();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(IssueCategory $category)
    {
        $project = $category->project;
        if (!$project->hasPermissionCreateIssue(auth()->id())) return $this->sendForbidden();
        $category->delete();
        return $this->sendRespondSuccess();
    }
}
