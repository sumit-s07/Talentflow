
TalentFlow is a mini hiring platform built with React that enables HR teams to manage jobs, candidates, and assessments—all without a backend. It supports drag-and-drop reordering, virtualized lists, live assessment previews, and offline persistence using IndexedDB.

 Usage Tutorial 
 YouTube Link:[Watch Tutorial – Mini Hiring Manager Platform](https://youtu.be/AP5C3zZmbfQ)


 Deployed Link :
[Live App – TalentFlow](https://talentflow-nine.vercel.app/)


IMPORTANT - To clear IndexedDB and reset app data, open DevTools → Application tab → IndexedDB → right-click the database → Delete. Then refresh the page to see changes.
# FOR DEVELOPERS

## TECH STACK USED

### Frontend
**VITE + REACT** - Vite rather than CRA(create react app) becuz its fast(native esModules at work). Vite only changes(re-render) affected modules not the whole page. Vite has a lot of plugins to work with(i used tailwindcss.Much smoother experience than CRA).

### Backend
**MSW + indexedDB** - Both MSW and MIRAGE JS has their pros and cons. MSW is lightweight,easy to debug,fast whereas MIRAGE JS is heavier but has its own ORM. MSW mocks api responses (like express js but it doesn't necessarily requires a running server it intercepts the request at browser level itself).MIRAGE JS also has this property. i am using MSW in this project as i dont have any complex nested data to use an ORM for.

### Database
**INDEXDdb** - it's a browser based database. always on user's device even when the user is offline. 

**FEATURES:**
1. HAS nosql structure(stores data as key values,not rows columns ).
2. we can easily create indexes n all for efficient retrieval of information.with this we can even make offline webapps.
3. it caches api responses for faster loads.

### Language
**Typescript**
1. Provides typsafe,scalable code.(easy to debug in future).
2. Has interfaces(strict structures which ensures things are consistent across whole application).

## Directory Structure

```
.
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public
│   ├── mockServiceWorker.js
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── Assessments
│   │   └── AssessmentBuilder.tsx
│   ├── Candidates
│   │   ├── CandidateProfile.tsx
│   │   ├── CandidatesList.tsx
│   │   └── KanbanBoard.tsx
│   ├── HomePages
│   │   ├── AssessmentPage.tsx
│   │   └── HomePage.tsx
│   ├── Jobs
│   │   ├── JobDetail.tsx
│   │   ├── JobFilters.tsx
│   │   └── JobsList.tsx
│   ├── Layout.tsx
│   ├── api
│   │   ├── JobsApi
│   │   │   ├── AssessmentApi.ts
│   │   │   └── JobsApi.ts
│   │   └── candidatesApi
│   │       └── candidateApi.ts
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── AssessmentComponents
│   │   │   ├── AssessmentPreview.tsx
│   │   │   ├── AssessmentRuntime.tsx
│   │   │   ├── QuestionEditor.tsx
│   │   │   └── SectionEditor.tsx
│   │   ├── CandidateComponents
│   │   │   ├── CandidateCard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── Note.tsx
│   │   │   ├── NoteInput.tsx
│   │   │   └── mentionStyles.css
│   │   ├── JobComponents
│   │   │   ├── JobForm.tsx
│   │   │   └── JobItem.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── pagination.tsx
│   ├── data
│   │   ├── AssessmentFunctions
│   │   │   └── assessment.ts
│   │   ├── CandidatesFunctions
│   │   │   ├── mockCandidates.ts
│   │   │   └── mockUsers.ts
│   │   ├── JobsData
│   │   │   └── Jobs.types.ts
│   │   └── database
│   │       ├── browser.ts
│   │       ├── db.ts
│   │       ├── handlers
│   │       │   ├── AssessmentHandlers.ts
│   │       │   ├── CandidateHandlers.ts
│   │       │   ├── JobHandlers.ts
│   │       │   └── index.ts
│   │       └── seed.ts
│   ├── hooks
│   │   ├── AssessmentHooks
│   │   │   └── useAssessmentBuilder.ts
│   │   ├── CandidatesHook
│   │   │   └── useCandidates.ts
│   │   └── JobsHooks
│   │       ├── useDragAndDrop.ts
│   │       └── useJobs.ts
│   ├── index.css
│   ├── main.tsx
│   ├── routes
│   │   └── routes.tsx
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

# LETS START STEP BY STEP

## Jobs Section

### Jobs.types.ts
Defines Job and JOb related interfaces for type safety.

### JobList.tsx
1. This is the opening of this app. A button on Homepage redirects user to the jobList page where all the lists of jobs are present. there's a separate api for fetching jobs and api handlers(MSW) for getting data from IndexedDB and sending back as reponse.
2. We Avoid prop drilling by using React router's outlet context in layout where we pass jobRefresher and EditOrCreateJobModal to childs. we then assign jobRefresher a function in our joblist component which we use from useJobs hook.Edit Modal is preassigned at layout level.

### JobFilters.tsx
1. It handles all the filtering logic. uses SetFilters function from useJobs hook to update any filter changes and refetches the entire list. it is used in joblist page.

### JobDetails.tsx
1. Shows Jobs details.
2. Uses a useEffect on mounting which has function to fetch job ids using an api. (defining a function for this task in useJObs hook to fetch from api and then using that function here would have been a cleaner approach as it will maintain consistency(and scalability ) of using useJobs hooks for such fetching ,deleting tasks(so i might update later).

### Components

#### Jobitems.tsx
1. Renders Jobitems card which has information regarding the job.
2. uses layout's editModal context for edit.Drag n drop props.
3. e.stopPropagation() is used as to prevent event bubbling .(it basically shouldn't trigger drag n drop handlers).

#### JobForm.tsx
1. This is what we use during both edit and create.
2. it checks if there is already data..it pre fills(merges with default form data) the form ,,else uses default form data.
3. and ofcourse as we are using typescript ,the interface is defined for props initially.

### DragnDrop.tsx
It contains drag n drop logic for our job lists. We are using useRef to track state changes rather than useState becuz useState would cause re-render each time our card being dragged would pass over some other card,,which will make out website extremly slow.

**JobHandlers and Jobapis** - self explanatory.

---

## Assessment Section

### Assessment.ts
Defines interfaces for sections,questions,asessment ,single choice,multichoice etc.

### Assessment Preview.tsx
1. supports both standalone preview and preview while editing the assessment.
2. It basically checks if assessment is being passed from props or there is an id on url to know if it needs to show standalone preview or preview while editing the real assessment. If it doesn't have a parent for props .. it directly communicates with api to get data.(standalone preview)

### CorrectAnswerEditor.tsx
1. gets functions as props from parent and handles correct answers.in case of changes,it sends those changes up to the parent.
2. Uses React.memo which basically means component re renders only if its props has changed. Doesn't matter if parent re-renders;

### QuestionEditor.tsx
1. it has different functions like handleOptionChange,handleTextChange etc.
2. it also uses React.memo together with useCallback. useCallback is used in functions which are being passed as props to React.memo wrapped component. its for optimization.

### SectionEditor.tsx
1. it gives data props to questioneditor.
2. It receives update events from its QuestionEditor children, consolidates those changes into a new section object, and then passes that complete update to its parent.

**Flow of props:** Parent Component -> SectionEditor -> QuestionEditor  
**Flow of events/updates:** QuestionEditor -> SectionEditor -> Parent Component -> API

### AssessentRuntime.tsx
This file is for candidate view while attempting assessment. its for future purposes. No use as of now.

### AssessmentBuilder.tsx
This is the main parent component of Assessment components discussed above. it uses if conditions to show separate views. if user has clicked edit, the view is different otherwise a list of assessment will be shown. Uses a state isDirty to check if anychanges have been made..only then save button will be enabled.

### useAssessmentBuilder.ts
1. handles all the api related calls. Initially it uses useEffect which fetches all the assessments for that jobId. then it returns different functions that can be used later by main assessment builder.
2. recieves (job id) as arguement from parent.

---

## CANDIDATES

### mockCandidates.ts
Intially it consisted of mockdata but now it consists of candidates Interface.

### mockUsers.ts
It contains mock users which will be shown during @mention in notes on candidate's profile.

### CandidateCard.tsx
CandidateCard is a reusable UI element designed to display a candidate's information. Its primary feature is that it's a draggable and sortable item built using the dnd-kit library.

### CandidateProfile.tsx
1. it uses useParams to get id from query and useEffect to fetch candidateId with candidateID in dependency array.
2. it has note Functionallity where delete Note uses optimistic update.(actual deleting process in background but shows immediately in UI). we use useState setCandidate to imeediately update UI;
3. it doesn;t take any props from parent and makes api calls itself directly.(i think bbetter would have been to use useCandidate.ts hook).

### CandidateList.tsx
1. it shows the list of all the candidats. it uses Virtualisation ..which means instead of rending lists of all the candidates at once ..it only renders items currently visible on the screen.To achieve this we are using @tanstack/react-virtual library.
2. All the complex logic for fetching, searching, and filtering candidates is neatly separated into the useCandidates custom hook. This makes the CandidatesList component much cleaner.
3. as we scroll library removes older items from dom and updates new one which makes this process very fast.

### KanbanBoard.tsx
1. it uses react Dnd-kit libray to efficienty perform drag and drop operations to move candidates across different stages.
2. Optimistic UI update on dropping.
3. uses UseMemo to cache result of candidates list on the basis of current stage.
4. Passes props down to kanbanColumn.

### KanbanColumn.tsx
1. uses useMemo and only re runs if candidates list in that column or search changes.
2. it is a controlled componenent in which onChange event triggers the onSearchChange which was passsed does from parents as a prop.
3. While the column itself is a drop zone, it also acts as a context provider for the draggable CandidateCard components inside it.

### Note.tsx
1. Styles @ mentions differently than plain text s compared
2. its a presentational component i.e it doesn't have any internal state/..its only job is to receive props and display them.
3. communicates with its parent via callback function (onDelete).

### NoteInput.tsx
1. use react-mentions so elegantly show mentions.
2. its also a controlled component that talks to its parent via callbacks. It manages its own temporary state while the user is typing but it delegates the final save action to its parent.

### useCandidates.ts
1. this hook manages all the api calls for candidates components.
2. uses both server side and client side filtering.The stageFilter is passed directly into the API call. This tells the server to do the heavy work of filtering the candidates by their hiring stage before sending the data to the browser.
3. After the stage-filtered data arrives, the useMemo block performs a secondary, instant search filter in the browser based on the searchTerm

---

## Additional Components

### Notfoundpage
Basic 404 message in case of invalid url.

### Pagination.tsx
1. its a controlled component it receives current page as a prop and uses callback function to call onPageChange function which triggeres the parent.
2. uses smart paging (loads only whats required). Reduces load on both server and client's network/memory.

### db.ts
1. Uses Dexie.js , apowerful library that simplifies working with indexed db.
2. here we create database,define tables ,schema for tables ,version number etc.
3. and in last we create a singleton instance of database that can be used across all files.

### seed.ts
1. it populates db with some initial data to work with(if no data is already present).
2. uses dexie's bulkAdd to add in db which is highly efficient as compared to making single transactions.

### Layout.tsx
1. manage features like createJob across all components
2. uses useOutletContext. it allows child to communicate with the layout. also in route.tsx for every url that stars with '/' we rae rendering layout.tsx first(which is an header).

### routes.tsx
Uses react-router-dom. consists information about all the routes present in the application. imported later in app.tsx.ld to communicate with the layout. also in route.tsx for every url that stars with '/' we rae rendering layout.tsx first(which is an header) . 

routes.tsx :: 
1. uses react-router-dom. consists information about all the routes present in the application. imported later in app.tsx.

Artificial latency and artificial error has also been added in job apis to test rollback feature n all.

hosted on vercel.


---

##  Known Limitations

### Drag-and-Drop Scope
- Drag-and-drop functionality works only within the same page or route.
- Attempting to drag elements across different pages (1 to 4) will not register a valid drop target.

###  Tag Creation
- Users can **select from existing tags**, but **cannot create new tags** dynamically within the UI.
- This is an intentional design choice to maintain controlled vocabularies.
- If dynamic tag creation is required, consider extending the schema and implementing a tag management interface.
 ### Authentication
 -Currently Auth is not implemented. In future it will be implementd.

