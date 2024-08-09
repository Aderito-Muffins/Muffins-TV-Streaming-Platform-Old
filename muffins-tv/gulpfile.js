const gulp = require('gulp');
const replace = require('gulp-replace');

// Definindo a tarefa 'add-script'
gulp.task('add-script', function() {
  return gulp.src('*.html') // Caminho para todos os arquivos HTML
    .pipe(replace(/<!-- Favicon -->\s*<link rel="shortcut icon" href="images\/favicon\.ico">/, `
      <!-- Favicon -->
      <link rel="shortcut icon" href="images/favicon.ico">
      <!-- Adicionando o script -->
      <script src="js/header.js" defer></script>
      <!-- CSS bootstrap-->`))
    .pipe(gulp.dest('dist')); // Pasta onde os arquivos modificados serão salvos
});

// Definindo a tarefa padrão
gulp.task('default', gulp.series('add-script'));
