import React from 'react';

function SidebarMenu({ activeTab, goToTab, onNewPost }) {
    const handleNewPostClick = (e, category) => {
        e.stopPropagation();
        if (onNewPost) onNewPost(category);
    };

    return (
        <div className="community-sidebar">
            <div className="sidebar-menu">
                <div className="menu-header">General Board</div>
                <div
                    className={`menu-item ${activeTab === 'popular' ? 'active' : ''}`}
                    id="menu-popular"
                    onClick={() => goToTab('popular')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') goToTab('popular'); }}
                >
                    Popular Posts
                </div>
                <div
                    className={`menu-item ${activeTab === 'tips' ? 'active' : ''}`}
                    id="menu-tips"
                    onClick={() => goToTab('tips')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') goToTab('tips'); }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <span>Tips & How-To</span>
                    <button
                        onClick={(e) => handleNewPostClick(e, 'tips')}
                        style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            backgroundColor: '#006d5d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        +
                    </button>
                </div>
                <div
                    className={`menu-item ${activeTab === 'data' ? 'active' : ''}`}
                    id="menu-data"
                    onClick={() => goToTab('data')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') goToTab('data'); }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <span>Data Sharing</span>
                    <button
                        onClick={(e) => handleNewPostClick(e, 'data')}
                        style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            backgroundColor: '#006d5d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        +
                    </button>
                </div>
                <div
                    className={`menu-item ${activeTab === 'mypost' ? 'active' : ''}`}
                    id="menu-mypost"
                    onClick={() => goToTab('mypost')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') goToTab('mypost'); }}
                >
                    My Post
                </div>
            </div>
        </div>
    );
}

export default SidebarMenu;
