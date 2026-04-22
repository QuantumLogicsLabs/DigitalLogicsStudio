import { useState } from "react";

const STORAGE_KEY = "logic_editor_saved_projects_v1";

export function SaveAndLoad({
    data,
    setGates,
    setWires,
    setGateIdCounter,
    setWireIdCounter,
    setInputCounter,
    setOutputCounter,
    saveToHistory
}) {
    const [showSave, setShowSave] = useState(false);
    const [showLoad, setShowLoad] = useState(false);
    const [projectName, setProjectName] = useState("");

    const getProjects = () =>
        JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    const setProjects = (p) =>
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));

    const saveProject = () => {
        if (!projectName.trim()) return;

        const projects = getProjects();

        if (projects[projectName]) {
            if (!window.confirm("Overwrite existing project?")) return;
        }

        projects[projectName] = {
            versions: [
                { ...data, time: Date.now() },
                ...(projects[projectName]?.versions || [])
            ].slice(0, 10)
        };

        setProjects(projects);
        setShowSave(false);
        setProjectName("");
    };

    const loadSnapshot = (snap) => {
        setGates(snap.gates || []);
        setWires(snap.wires || []);
        setGateIdCounter(snap.gateIdCounter || 0);
        setWireIdCounter(snap.wireIdCounter || 0);
        setInputCounter(snap.inputCounter || 0);
        setOutputCounter(snap.outputCounter || 0);
        saveToHistory();
        setShowLoad(false);
    };

    const deleteProject = (name) => {
        const p = getProjects();
        delete p[name];
        setProjects(p);
        setShowLoad(true);
    };

    const projects = getProjects();
    const names = Object.keys(projects);

    return (
        <>
            <button
                className="logic-circuit-project-manager-primary-action-button first"
                onClick={() => setShowSave(true)}
            >
                Save Project
            </button>

            <button
                className="logic-circuit-project-manager-primary-action-button"
                onClick={() => setShowLoad(true)}
            >
                Load Project
            </button>

            {/* SAVE MODAL */}

            {showSave && (
                <div className="logic-circuit-project-manager-fullscreen-overlay-background-container">
                    <div className="logic-circuit-project-manager-modal-window-card-container">

                        <h3 className="logic-circuit-project-manager-modal-title-text-heading">
                            Save Project
                        </h3>

                        <input
                            className="logic-circuit-project-manager-project-name-text-input-field"
                            value={projectName}
                            onChange={e => setProjectName(e.target.value)}
                            placeholder="Project name"
                        />

                        <div className="logic-circuit-project-manager-modal-button-row-layout-wrapper">

                            <button
                                className="logic-circuit-project-manager-confirm-save-button"
                                onClick={saveProject}
                            >
                                Save
                            </button>

                            <button
                                className="logic-circuit-project-manager-cancel-close-button"
                                onClick={() => setShowSave(false)}
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* LOAD MODAL */}

            {showLoad && (
                <div className="logic-circuit-project-manager-fullscreen-overlay-background-container">
                    <div className="logic-circuit-project-manager-modal-window-card-container">

                        <h3 className="logic-circuit-project-manager-modal-title-text-heading">
                            Load Project
                        </h3>

                        {names.length === 0 && (
                            <div className="logic-circuit-project-manager-empty-projects-placeholder-message">
                                No projects saved
                            </div>
                        )}

                        {names.map(name => (
                            <div
                                key={name}
                                className="logic-circuit-project-manager-project-row-item-container"
                            >
                                <span>{name}</span>

                                <div className="logic-circuit-project-manager-project-row-button-group-wrapper">

                                    <button
                                        className="logic-circuit-project-manager-small-load-button"
                                        onClick={() => loadSnapshot(projects[name].versions[0])}
                                    >
                                        Load
                                    </button>

                                    <button
                                        className="logic-circuit-project-manager-small-delete-button"
                                        onClick={() => deleteProject(name)}
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        ))}

                        <button
                            className="logic-circuit-project-manager-cancel-close-button"
                            onClick={() => setShowLoad(false)}
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}
        </>
    );
}
