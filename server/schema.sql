CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    position VARCHAR(150) NOT NULL,
    status VARCHAR(20) NOT NULL
        CHECK (status IN (
            'Applied',
            'Interview',
            'Offer',
            'Rejected'
        )),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
