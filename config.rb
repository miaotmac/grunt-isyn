require 'compass/import-once/activate'
# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "css"
sass_dir = "sass"
images_dir = "img"
javascripts_dir = "js"
output_style = :compressed

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
# 这里做了一个 copy 而不是直接重命名；你可以用 FileUtils.mv 直接重命名

on_sprite_saved do |filename|
  if File.exists?(filename)
    FileUtils.cp filename, filename.gsub(%r{-s[a-z0-9]{10}\.png$}, '.png')
    #FileUtils.mv filename, filename.gsub(%r{-s[a-z0-9]{10}\.png$}, '.png')
  end
end

# require 'autoprefixer-rails'

on_stylesheet_saved do |filename|
  if File.exists?(filename)
    # css = File.read filename
    css = File.open(filename, 'rb').readlines.join
    File.open(filename, 'wb+') do |buffer|
      # buffer << css.gsub(%r{-s[a-z0-9]{10}\.png}, '.png')
      buffer.write(css.gsub(%r{-s[a-z0-9]{10}\.png}, '.png'))
    end
    # css2 = File.open(filename, 'rb').readlines.join
    # File.open(filename, 'w') { |io| io << AutoprefixerRails.process(css2) }
  end
end


# on_stylesheet_saved do |file|
#   css = File.read(file)
#   map = file + '.map'

#   if File.exists? map
#     result = AutoprefixerRails.process(css,
#       from: file,
#       to:   file,
#       map:  { prev: File.read(map), inline: false })
#     File.open(file, 'w') { |io| io << result.css }
#     File.open(map,  'w') { |io| io << result.map }
#   else
#     File.open(file, 'w') { |io| io << AutoprefixerRails.process(css) }
#   end
# end
