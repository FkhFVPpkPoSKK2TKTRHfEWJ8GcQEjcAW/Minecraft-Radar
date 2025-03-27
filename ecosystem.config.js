module.exports = {
	apps: [
		{
			name: "Base-Radar",  // Name of your application
			script: "./main.js",  // Entry point of your application
			watch: false,  // Enable automatic restarts on file changes
			env_production: {
				NODE_ENV: "production",  // Environment variables for production
			},
			log_date_format: "YYYY-MM-DD HH:mm:ss",  // Log format
			error_file: "./logs/error.log",  // Error log file
			out_file: "./logs/output.log",  // Output log file
			merge_logs: true,  // Merge logs from different instances
			pid_file: "./pids/BED-CA.pid",  // File to store the process ID
		}
	],
};